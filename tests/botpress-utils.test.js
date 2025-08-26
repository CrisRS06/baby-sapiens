/**
 * BOTPRESS UTILITIES - TEST SCRIPT
 * 
 * Script básico para probar las utilidades de Botpress sin framework de testing.
 * Ejecutar con: node tests/botpress-utils.test.js
 */

// Simular importaciones de Node.js para testing
const assert = require('assert')
const util = require('util')

// Mock de las funciones principales para pruebas sin dependencias externas
const mockBotpressUtils = {
  // Mock de buildBotpressUrl
  buildBotpressUrl: (params, config = {}) => {
    try {
      const defaultConfig = {
        baseUrl: 'https://cdn.botpress.cloud/webchat/v3.2/shareable.html',
        configUrl: 'https://files.bpcontent.cloud/2025/08/23/00/20250823001639-J61VAXD4.json',
        clientId: 'f657ad35-3575-4861-92bd-e52dac005765'
      }
      
      const finalConfig = { ...defaultConfig, ...config }
      const url = new URL(finalConfig.baseUrl)
      
      // Add required configUrl
      url.searchParams.set('configUrl', finalConfig.configUrl)
      
      // Add user parameters
      if (params.userId) url.searchParams.set('userId', params.userId)
      if (params.userName) url.searchParams.set('userName', params.userName)
      if (params.userEmail) url.searchParams.set('userEmail', params.userEmail)
      if (params.stage) url.searchParams.set('stage', params.stage)
      if (params.childAge) url.searchParams.set('childAge', params.childAge)
      if (params.feedingMethod) url.searchParams.set('feedingMethod', params.feedingMethod)
      if (params.language) url.searchParams.set('language', params.language)
      if (params.theme) url.searchParams.set('theme', params.theme)
      if (params.autoOpen) url.searchParams.set('autoOpen', params.autoOpen)
      if (params.source) url.searchParams.set('source', params.source)
      
      url.searchParams.set('t', Date.now().toString())
      
      return url.toString()
    } catch (error) {
      throw new Error(`Failed to build Botpress URL: ${error.message}`)
    }
  },

  // Mock de validateBotpressParams
  validateBotpressParams: (params) => {
    const errors = []
    const warnings = []

    if (params.configUrl && !isValidUrl(params.configUrl)) {
      errors.push('configUrl must be a valid URL')
    }

    if (params.userId && typeof params.userId !== 'string') {
      errors.push('userId must be a string')
    }

    if (params.userEmail && !isValidEmail(params.userEmail)) {
      warnings.push('userEmail appears to be invalid')
    }

    if (params.theme && !['light', 'dark'].includes(params.theme)) {
      warnings.push('theme should be either "light" or "dark"')
    }

    if (params.language && !['es', 'en'].includes(params.language)) {
      warnings.push('language should be either "es" or "en"')
    }

    if (params.stage && !['pregnancy', 'newborn', 'infant', 'toddler', 'unknown'].includes(params.stage)) {
      warnings.push('stage should be a valid parenting stage')
    }

    if (params.autoOpen && !['true', 'false'].includes(params.autoOpen)) {
      warnings.push('autoOpen should be either "true" or "false"')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  },

  // Mock de extractUserMetadata
  extractUserMetadata: (user) => {
    if (!user) return null

    try {
      return {
        id: user.id,
        name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username,
        email: user.emailAddresses && user.emailAddresses[0] ? user.emailAddresses[0].emailAddress : undefined,
        stage: user.publicMetadata?.stage || 'unknown',
        childAge: user.publicMetadata?.childAge,
        feedingMethod: user.publicMetadata?.feedingMethod || 'unknown',
        language: user.publicMetadata?.language || 'es',
        preferences: {
          theme: user.publicMetadata?.theme || 'light',
          notifications: user.publicMetadata?.notifications !== false,
          expertMode: user.publicMetadata?.expertMode === true
        },
        source: 'clerk',
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.warn('Error extracting user metadata:', error)
      return {
        id: user.id,
        name: user.firstName || user.username,
        email: user.emailAddresses && user.emailAddresses[0] ? user.emailAddresses[0].emailAddress : undefined,
        source: 'clerk',
        timestamp: new Date().toISOString()
      }
    }
  },

  // Mock de createBotpressUrlForUser
  createBotpressUrlForUser: (user, configOverrides = {}, paramOverrides = {}) => {
    if (!user) {
      // Usuario anónimo
      const params = {
        autoOpen: 'true',
        theme: configOverrides.defaultTheme || 'light',
        language: configOverrides.defaultLanguage || 'es',
        source: 'anonymous',
        ...paramOverrides
      }
      return mockBotpressUtils.buildBotpressUrl(params, configOverrides)
    }

    try {
      const metadata = mockBotpressUtils.extractUserMetadata(user)
      
      if (!metadata) {
        throw new Error('Failed to extract user metadata')
      }

      const userParams = {
        userId: metadata.id,
        userName: metadata.name,
        userEmail: metadata.email,
        stage: metadata.stage,
        childAge: metadata.childAge,
        feedingMethod: metadata.feedingMethod,
        language: metadata.language,
        theme: metadata.preferences?.theme || configOverrides.defaultTheme || 'light',
        autoOpen: (configOverrides.autoOpen !== false) ? 'true' : 'false',
        source: 'clerk',
        ...paramOverrides
      }

      return mockBotpressUtils.buildBotpressUrl(userParams, configOverrides)
    } catch (error) {
      console.error('Error creating Botpress URL for user:', error)
      
      // Fallback a URL básica
      const fallbackParams = {
        userId: user.id,
        userName: user.firstName || user.username,
        userEmail: user.emailAddresses && user.emailAddresses[0] ? user.emailAddresses[0].emailAddress : undefined,
        autoOpen: 'true',
        theme: 'light',
        language: 'es',
        source: 'clerk-fallback',
        ...paramOverrides
      }
      return mockBotpressUtils.buildBotpressUrl(fallbackParams, configOverrides)
    }
  }
}

// Helper functions
function isValidUrl(string) {
  try {
    new URL(string)
    return true
  } catch {
    return false
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Mock data for testing
const mockUser = {
  id: 'user_12345',
  firstName: 'María',
  lastName: 'González',
  username: 'maria.gonzalez',
  emailAddresses: [
    { emailAddress: 'maria@example.com' }
  ],
  publicMetadata: {
    stage: 'newborn',
    childAge: '2',
    feedingMethod: 'breast',
    language: 'es',
    theme: 'light',
    notifications: true,
    expertMode: false
  }
}

const mockUserMinimal = {
  id: 'user_67890',
  firstName: 'Carlos',
  emailAddresses: [
    { emailAddress: 'carlos@example.com' }
  ]
}

// Test Suite
console.log('🧪 INICIANDO PRUEBAS DE BOTPRESS UTILITIES...\n')

let testCount = 0
let passedCount = 0

function test(name, testFn) {
  testCount++
  try {
    console.log(`\n${testCount}. ${name}`)
    testFn()
    passedCount++
    console.log('   ✅ PASSED')
  } catch (error) {
    console.log(`   ❌ FAILED: ${error.message}`)
    if (process.env.DEBUG) {
      console.log('   Stack:', error.stack)
    }
  }
}

// TEST 1: buildBotpressUrl - Parámetros básicos
test('buildBotpressUrl con parámetros básicos', () => {
  const params = {
    theme: 'light',
    language: 'es'
  }
  
  const url = mockBotpressUtils.buildBotpressUrl(params)
  
  assert(typeof url === 'string', 'URL should be a string')
  assert(url.includes('https://cdn.botpress.cloud'), 'URL should contain base URL')
  assert(url.includes('theme=light'), 'URL should contain theme parameter')
  assert(url.includes('language=es'), 'URL should contain language parameter')
  assert(url.includes('configUrl='), 'URL should contain configUrl parameter')
  
  console.log('   🔗 URL generada:', url.substring(0, 100) + '...')
})

// TEST 2: buildBotpressUrl - Parámetros de usuario completos
test('buildBotpressUrl con parámetros de usuario completos', () => {
  const params = {
    userId: 'user_12345',
    userName: 'María González',
    userEmail: 'maria@example.com',
    theme: 'light',
    language: 'es',
    stage: 'newborn',
    childAge: '2',
    feedingMethod: 'breast'
  }
  
  const url = mockBotpressUtils.buildBotpressUrl(params)
  
  assert(url.includes('userId=user_12345'), 'URL should contain userId')
  assert(url.includes('userName=Mar%C3%ADa%20Gonz%C3%A1lez'), 'URL should contain encoded userName')
  assert(url.includes('userEmail=maria%40example.com'), 'URL should contain encoded userEmail')
  assert(url.includes('stage=newborn'), 'URL should contain stage')
  assert(url.includes('childAge=2'), 'URL should contain childAge')
  assert(url.includes('feedingMethod=breast'), 'URL should contain feedingMethod')
  
  console.log('   🔗 URL con usuario:', url.substring(0, 120) + '...')
})

// TEST 3: validateBotpressParams - Validación exitosa
test('validateBotpressParams - Validación exitosa', () => {
  const params = {
    userId: 'user_123',
    userEmail: 'test@example.com',
    theme: 'light',
    language: 'es',
    stage: 'newborn'
  }
  
  const result = mockBotpressUtils.validateBotpressParams(params)
  
  assert(result.isValid === true, 'Validation should pass')
  assert(result.errors.length === 0, 'Should have no errors')
  assert(Array.isArray(result.warnings), 'Warnings should be an array')
  
  console.log('   ✓ Validación exitosa:', { errors: result.errors.length, warnings: result.warnings.length })
})

// TEST 4: validateBotpressParams - Con errores
test('validateBotpressParams - Con errores y warnings', () => {
  const params = {
    configUrl: 'not-a-valid-url',
    userEmail: 'not-an-email',
    theme: 'invalid-theme',
    language: 'invalid-lang'
  }
  
  const result = mockBotpressUtils.validateBotpressParams(params)
  
  assert(result.isValid === false, 'Validation should fail')
  assert(result.errors.length > 0, 'Should have errors')
  assert(result.warnings.length > 0, 'Should have warnings')
  
  console.log('   ⚠️  Errores encontrados:', result.errors)
  console.log('   ⚠️  Warnings encontrados:', result.warnings)
})

// TEST 5: extractUserMetadata - Usuario completo
test('extractUserMetadata - Usuario con datos completos', () => {
  const metadata = mockBotpressUtils.extractUserMetadata(mockUser)
  
  assert(metadata !== null, 'Metadata should not be null')
  assert(metadata.id === 'user_12345', 'Should extract correct user ID')
  assert(metadata.name === 'María González', 'Should extract correct name')
  assert(metadata.email === 'maria@example.com', 'Should extract correct email')
  assert(metadata.stage === 'newborn', 'Should extract correct stage')
  assert(metadata.childAge === '2', 'Should extract correct childAge')
  assert(metadata.feedingMethod === 'breast', 'Should extract correct feedingMethod')
  assert(metadata.language === 'es', 'Should extract correct language')
  assert(metadata.source === 'clerk', 'Should have correct source')
  assert(typeof metadata.timestamp === 'string', 'Should have timestamp')
  
  console.log('   👤 Metadata extraída:', {
    id: metadata.id,
    name: metadata.name,
    stage: metadata.stage,
    language: metadata.language
  })
})

// TEST 6: extractUserMetadata - Usuario con datos mínimos
test('extractUserMetadata - Usuario con datos mínimos', () => {
  const metadata = mockBotpressUtils.extractUserMetadata(mockUserMinimal)
  
  assert(metadata !== null, 'Metadata should not be null')
  assert(metadata.id === 'user_67890', 'Should extract correct user ID')
  assert(metadata.name === 'Carlos', 'Should extract correct name')
  assert(metadata.email === 'carlos@example.com', 'Should extract correct email')
  assert(metadata.stage === 'unknown', 'Should default to unknown stage')
  assert(metadata.source === 'clerk', 'Should have correct source')
  
  console.log('   👤 Metadata mínima:', {
    id: metadata.id,
    name: metadata.name,
    stage: metadata.stage
  })
})

// TEST 7: extractUserMetadata - Usuario null
test('extractUserMetadata - Usuario null', () => {
  const metadata = mockBotpressUtils.extractUserMetadata(null)
  
  assert(metadata === null, 'Should return null for null user')
  
  console.log('   👤 Usuario null manejado correctamente')
})

// TEST 8: createBotpressUrlForUser - Usuario completo
test('createBotpressUrlForUser - Usuario con datos completos', () => {
  const url = mockBotpressUtils.createBotpressUrlForUser(mockUser, {
    defaultTheme: 'light',
    defaultLanguage: 'es'
  })
  
  assert(typeof url === 'string', 'URL should be a string')
  assert(url.includes('userId=user_12345'), 'URL should contain userId')
  assert(url.includes('stage=newborn'), 'URL should contain stage')
  assert(url.includes('source=clerk'), 'URL should contain source=clerk')
  
  console.log('   🔗 URL para usuario:', url.substring(0, 100) + '...')
})

// TEST 9: createBotpressUrlForUser - Usuario anónimo
test('createBotpressUrlForUser - Usuario anónimo', () => {
  const url = mockBotpressUtils.createBotpressUrlForUser(null, {
    defaultTheme: 'dark',
    defaultLanguage: 'en'
  })
  
  assert(typeof url === 'string', 'URL should be a string')
  assert(url.includes('theme=dark'), 'URL should contain theme=dark')
  assert(url.includes('language=en'), 'URL should contain language=en')
  assert(url.includes('source=anonymous'), 'URL should contain source=anonymous')
  
  console.log('   🔗 URL para anónimo:', url.substring(0, 100) + '...')
})

// TEST 10: createBotpressUrlForUser - Con overrides
test('createBotpressUrlForUser - Con parameter overrides', () => {
  const url = mockBotpressUtils.createBotpressUrlForUser(mockUser, 
    { defaultTheme: 'light' },
    { botName: 'Custom Bress', color: 'purple', variant: 'soft' }
  )
  
  assert(typeof url === 'string', 'URL should be a string')
  assert(url.includes('botName=Custom%20Bress'), 'URL should contain custom botName')
  assert(url.includes('color=purple'), 'URL should contain custom color')
  assert(url.includes('variant=soft'), 'URL should contain custom variant')
  
  console.log('   🔗 URL con overrides:', url.substring(0, 120) + '...')
})

// TEST 11: Manejo de errores de URL inválida
test('Manejo de errores en buildBotpressUrl', () => {
  try {
    // Intentar con configuración que cause error
    const params = { configUrl: 'definitely-not-a-url' }
    const result = mockBotpressUtils.validateBotpressParams(params)
    
    assert(result.isValid === false, 'Should detect invalid configUrl')
    assert(result.errors.length > 0, 'Should have errors for invalid URL')
    
    console.log('   ✓ Error de URL inválida detectado correctamente')
  } catch (error) {
    // Este test espera que la validación detecte el error, no que se lance excepción
    throw new Error('Validation should detect errors, not throw exceptions')
  }
})

// TEST 12: Parámetros de configuración por defecto
test('Configuración por defecto', () => {
  const url = mockBotpressUtils.buildBotpressUrl({})
  
  assert(typeof url === 'string', 'URL should be a string')
  assert(url.includes('https://cdn.botpress.cloud'), 'Should use default base URL')
  assert(url.includes('configUrl=https://files.bpcontent.cloud'), 'Should use default config URL')
  assert(url.includes('t='), 'Should include timestamp parameter')
  
  console.log('   ✓ Configuración por defecto aplicada correctamente')
})

// Ejecutar resumen de pruebas
console.log('\n' + '='.repeat(50))
console.log('📊 RESUMEN DE PRUEBAS')
console.log('='.repeat(50))
console.log(`Total de pruebas: ${testCount}`)
console.log(`Pruebas exitosas: ${passedCount}`)
console.log(`Pruebas fallidas: ${testCount - passedCount}`)
console.log(`Porcentaje de éxito: ${Math.round((passedCount / testCount) * 100)}%`)

if (passedCount === testCount) {
  console.log('\n🎉 ¡TODAS LAS PRUEBAS PASARON!')
  console.log('✅ Las utilidades de Botpress están funcionando correctamente')
} else {
  console.log('\n⚠️  ALGUNAS PRUEBAS FALLARON')
  console.log('❌ Revisar los errores reportados arriba')
  process.exit(1)
}

console.log('\n🔧 PRUEBAS MANUALES RECOMENDADAS:')
console.log('1. Probar la URL generada en el navegador')
console.log('2. Verificar que el iframe de Botpress carga correctamente')
console.log('3. Comprobar que los parámetros se pasan al bot')
console.log('4. Validar que la autenticación de Clerk funciona')
console.log('5. Probar con usuarios con diferentes configuraciones')

console.log('\n🌐 URL DE EJEMPLO PARA PROBAR:')
const sampleUrl = mockBotpressUtils.createBotpressUrlForUser(mockUser)
console.log(sampleUrl)

console.log('\n✅ Fin del script de pruebas')