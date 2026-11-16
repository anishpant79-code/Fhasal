const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

const DB_FILE = path.join(__dirname, '..', 'dev-storage.json')

const loadStore = () => {
    try {
        if (fs.existsSync(DB_FILE)) {
            const raw = fs.readFileSync(DB_FILE, 'utf8')
            return JSON.parse(raw)
        }
    } catch (e) {
        console.error('Error reading dev-storage.json:', e.message)
    }
    return { users: [], fields: [] }
}

const saveStore = (data) => {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8')
    } catch (e) {
        console.error('Error writing dev-storage.json:', e.message)
    }
}

class DevQuery {
    constructor(executor) {
        this.executor = executor
    }

    select(_fields) {
        return this
    }

    sort(_criteria) {
        return this
    }

    async exec() {
        return await this.executor()
    }

    then(resolve, reject) {
        return this.exec().then(resolve, reject)
    }

    catch(reject) {
        return this.exec().catch(reject)
    }
}

class DevUserDoc {
    constructor(data) {
        Object.assign(this, data)
        if (!this._id) {
            this._id = new mongoose.Types.ObjectId().toString()
        } else {
            this._id = this._id.toString()
        }
        this.createdAt = this.createdAt || new Date().toISOString()
        this.updatedAt = new Date().toISOString()
    }

    async comparePassword(candidatePassword) {
        return bcrypt.compare(candidatePassword, this.password)
    }

    async save() {
        const store = loadStore()
        if (this.password && !this.password.startsWith('$2a$') && !this.password.startsWith('$2b$')) {
            this.password = await bcrypt.hash(this.password, 10)
        }
        this.updatedAt = new Date().toISOString()
        const idx = store.users.findIndex(u => u._id.toString() === this._id.toString())
        const plain = { ...this }
        if (idx >= 0) {
            store.users[idx] = plain
        } else {
            store.users.push(plain)
        }
        saveStore(store)
        return this
    }

    toObject() {
        const obj = { ...this }
        obj.id = obj._id.toString()
        return obj
    }
}

class DevFieldDoc {
    constructor(data) {
        Object.assign(this, data)
        if (!this._id) {
            this._id = new mongoose.Types.ObjectId().toString()
        } else {
            this._id = this._id.toString()
        }
        if (this.owner) {
            this.owner = this.owner.toString()
        }
        this.createdAt = this.createdAt || new Date().toISOString()
        this.updatedAt = new Date().toISOString()
    }

    toObject() {
        const obj = { ...this }
        obj.id = obj._id.toString()
        obj._id = obj._id.toString()
        return obj
    }

    async save() {
        const store = loadStore()
        this.updatedAt = new Date().toISOString()
        const idx = store.fields.findIndex(f => f._id.toString() === this._id.toString())
        const plain = { ...this }
        if (idx >= 0) {
            store.fields[idx] = plain
        } else {
            store.fields.push(plain)
        }
        saveStore(store)
        return this
    }
}

const UserModel = {
    findOne(query) {
        return new DevQuery(async () => {
            const store = loadStore()
            let match = null
            if (query.email) {
                const emailLower = String(query.email).toLowerCase().trim()
                match = store.users.find(u => u.email.toLowerCase() === emailLower)
            } else if (query.resetPasswordToken) {
                match = store.users.find(u =>
                    u.resetPasswordToken === query.resetPasswordToken &&
                    (!query.resetPasswordExpires || new Date(u.resetPasswordExpires) > Date.now())
                )
            } else if (query._id) {
                match = store.users.find(u => u._id.toString() === query._id.toString())
            }
            if (!match) return null
            return new DevUserDoc(match)
        })
    },

    findById(id) {
        return new DevQuery(async () => {
            if (!id) return null
            const store = loadStore()
            const match = store.users.find(u => u._id.toString() === id.toString())
            if (!match) return null
            return new DevUserDoc(match)
        })
    },

    async create(data) {
        const store = loadStore()
        const emailLower = String(data.email).toLowerCase().trim()
        if (store.users.some(u => u.email.toLowerCase() === emailLower)) {
            const err = new Error('Email is already registered')
            err.code = 11000
            throw err
        }
        const hashedPassword = await bcrypt.hash(data.password, 10)
        const user = new DevUserDoc({
            ...data,
            email: emailLower,
            password: hashedPassword,
            role: data.role || 'farmer',
            location: data.location || '',
            district: data.district || '',
            state: data.state || '',
            bio: data.bio || '',
            preferredLanguage: data.preferredLanguage || 'en',
            preferredUnit: data.preferredUnit || 'Acre',
        })
        store.users.push({ ...user })
        saveStore(store)
        return user
    }
}

const FieldModel = {
    find(query = {}) {
        return new DevQuery(async () => {
            const store = loadStore()
            let results = store.fields
            if (query.owner) {
                results = results.filter(f => f.owner.toString() === query.owner.toString())
            }
            // Sort by createdAt descending
            results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            return results.map(f => new DevFieldDoc(f))
        })
    },

    findOne(query = {}) {
        return new DevQuery(async () => {
            const store = loadStore()
            const match = store.fields.find(f => {
                if (query._id && f._id.toString() !== query._id.toString()) return false
                if (query.owner && f.owner.toString() !== query.owner.toString()) return false
                return true
            })
            if (!match) return null
            return new DevFieldDoc(match)
        })
    },

    findById(id) {
        return new DevQuery(async () => {
            if (!id) return null
            const store = loadStore()
            const match = store.fields.find(f => f._id.toString() === id.toString())
            if (!match) return null
            return new DevFieldDoc(match)
        })
    },

    async create(data) {
        const store = loadStore()
        const field = new DevFieldDoc(data)
        store.fields.push({ ...field })
        saveStore(store)
        return field
    },

    findOneAndUpdate(query, updateData, _options) {
        return new DevQuery(async () => {
            const store = loadStore()
            const idx = store.fields.findIndex(f => {
                if (query._id && f._id.toString() !== query._id.toString()) return false
                if (query.owner && f.owner.toString() !== query.owner.toString()) return false
                return true
            })
            if (idx === -1) return null
            const updated = {
                ...store.fields[idx],
                ...updateData,
                updatedAt: new Date().toISOString(),
            }
            store.fields[idx] = updated
            saveStore(store)
            return new DevFieldDoc(updated)
        })
    },

    findOneAndDelete(query) {
        return new DevQuery(async () => {
            const store = loadStore()
            const idx = store.fields.findIndex(f => {
                if (query._id && f._id.toString() !== query._id.toString()) return false
                if (query.owner && f.owner.toString() !== query.owner.toString()) return false
                return true
            })
            if (idx === -1) return null
            const [deleted] = store.fields.splice(idx, 1)
            saveStore(store)
            return new DevFieldDoc(deleted)
        })
    }
}

module.exports = {
    UserModel,
    FieldModel,
    DevUserDoc,
    DevFieldDoc,
}
