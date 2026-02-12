# CORS Configuration Options

## Option 1: Accept All Domains (Current - No Credentials)
```javascript
app.use(cors({
    origin: '*',
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```
**Use this when:** You don't need to send cookies

## Option 2: Accept All Domains WITH Credentials
```javascript
app.use(cors({
    origin: function(origin, callback) {
        // Allow all origins
        callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```
**Use this when:** You need to send cookies or use credentials

## Option 3: Specific Domains Only
```javascript
const allowedOrigins = [
    'http://localhost:5173',
    'https://your-frontend-domain.com',
    'https://your-frontend-domain.vercel.app'
];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```
**Use this when:** You want to restrict to specific domains only

---

**Current Status:** Using Option 1 (all domains, no credentials)
**Note:** Your app uses JWT tokens in Authorization headers, so Option 1 should work fine!
