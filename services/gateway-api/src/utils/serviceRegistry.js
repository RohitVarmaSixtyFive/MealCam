/*
 * PLACEHOLDER: Service Registry and Health Monitoring
 * 
 * This module manages microservice discovery and health monitoring:
 * 
 * Functions to implement:
 * - registerService(serviceName, url) - Register a microservice
 * - getServiceUrl(serviceName) - Get URL for a service
 * - checkServiceHealth(serviceName) - Health check for service
 * - getAllServicesHealth() - Get health status of all services
 * - handleServiceFailure(serviceName) - Handle service failures
 * 
 * Features:
 * - Circuit breaker pattern
 * - Load balancing for multiple instances
 * - Automatic failover
 * - Service discovery
 * - Health monitoring dashboard
 * 
 * Integration:
 * - Consul or etcd for service discovery
 * - Health check endpoints
 * - Metrics collection
 */

const axios = require('axios');

class ServiceRegistry {
  constructor() {
    this.services = new Map();
    this.healthStatus = new Map();
    this.initializeServices();
    this.startHealthMonitoring();
  }

  initializeServices() {
    // Register known services
    this.registerService('auth', process.env.AUTH_SERVICE_URL || 'http://localhost:3001');
    this.registerService('meals', process.env.MEALS_SERVICE_URL || 'http://localhost:3002');
    this.registerService('ai', process.env.AI_SERVICE_URL || 'http://localhost:3003');
  }

  registerService(name, url) {
    this.services.set(name, {
      url,
      registeredAt: new Date(),
      lastHealthCheck: null,
      isHealthy: true,
      failureCount: 0
    });
    
    console.log(`Service registered: ${name} at ${url}`);
  }

  getServiceUrl(name) {
    const service = this.services.get(name);
    return service?.url;
  }

  async checkServiceHealth(name) {
    const service = this.services.get(name);
    if (!service) return false;

    try {
      const response = await axios.get(`${service.url}/health`, {
        timeout: 5000
      });

      const isHealthy = response.status === 200 && response.data.status === 'healthy';
      
      this.updateServiceHealth(name, isHealthy);
      return isHealthy;
    } catch (error) {
      console.error(`Health check failed for ${name}:`, error.message);
      this.updateServiceHealth(name, false);
      return false;
    }
  }

  updateServiceHealth(name, isHealthy) {
    const service = this.services.get(name);
    if (service) {
      service.isHealthy = isHealthy;
      service.lastHealthCheck = new Date();
      
      if (!isHealthy) {
        service.failureCount++;
      } else {
        service.failureCount = 0;
      }

      this.healthStatus.set(name, {
        isHealthy,
        lastCheck: service.lastHealthCheck,
        failureCount: service.failureCount
      });
    }
  }

  async getAllServicesHealth() {
    const healthPromises = Array.from(this.services.keys()).map(async (name) => {
      const isHealthy = await this.checkServiceHealth(name);
      return { name, isHealthy };
    });

    const results = await Promise.allSettled(healthPromises);
    return results.map(result => result.value);
  }

  startHealthMonitoring() {
    // Check service health every 30 seconds
    setInterval(async () => {
      await this.getAllServicesHealth();
    }, 30000);
  }

  getServiceStatus() {
    const status = {};
    for (const [name, service] of this.services) {
      status[name] = {
        url: service.url,
        isHealthy: service.isHealthy,
        lastHealthCheck: service.lastHealthCheck,
        failureCount: service.failureCount
      };
    }
    return status;
  }
}

// Export singleton instance
module.exports = new ServiceRegistry();
