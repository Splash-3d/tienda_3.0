const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al abrir la base de datos', err.message);
        process.exit(1);
    }
    console.log('Conectado a la base de datos SQLite');
    
    // Eliminar usuario admin antiguo
    db.run('DELETE FROM usuarios WHERE email = ?', ['admin@tienda.com'], function(err) {
        if (err) {
            console.error('Error al eliminar usuario antiguo:', err.message);
        } else {
            console.log(`Usuario antiguo eliminado: ${this.changes} filas afectadas`);
        }
        
        // Crear nuevo usuario admin
        const adminEmail = 'lighting2385@gmail.com';
        const adminPassword = 'Pitimirri2385';
        const hashedPassword = bcrypt.hashSync(adminPassword, 10);
        
        db.run('INSERT OR REPLACE INTO usuarios (email, password) VALUES (?, ?)', 
            [adminEmail, hashedPassword], 
            function(err) {
                if (err) {
                    console.error('Error al crear nuevo usuario:', err.message);
                } else {
                    console.log('✅ Nuevo usuario admin creado:');
                    console.log(`📧 Email: ${adminEmail}`);
                    console.log('🔑 Contraseña: Pitimirri2385');
                }
                
                db.close((err) => {
                    if (err) {
                        console.error('Error al cerrar la base de datos:', err.message);
                    } else {
                        console.log('Base de datos cerrada');
                    }
                    process.exit(0);
                });
            }
        );
    });
});
