# KohoApiHelper

API Helper for Koho Sales ERP (<http://www.kohosales.com/>)

## Installation

Install from npm:

```
npm install @rantalainen/koho-api-helper
```

## Usage

### Import to NodeJS project

```javascript
const KohoApiHelper = require('koho-api-helper').KohoApiHelper;
```

### Import to TypeScript project

```javascript
import { KohoApiHelper } from 'koho-api-helper';
```

### Setup with options

```javascript
const kohoApiHelperOptions = {
  token: 'KOHO_API_TOKEN', // Token from Company Koho settings
  companyId: 1234, // Company ID in Koho, optional if enterpriseId is defined

  // Optional options
  enterpriseId: 1234, // Enterprise ID in Koho, if defined make sure to use enterprise token
  url: 'https://suite-beta.koho-online.com/api', // You can override API url with this property
  useKeepAliveAgent: true, // If you are spamming multiple requests to Koho, you should set this to true so that connections are reused

  // Added in 2.0.0, disable streaming for Koho GET requests, defaults to false and GET requests are streamed
  disableStreaming: true,

  // Added in 3.1.0, optional throttleOptions
  throttleOptions: {
    enabled: true, // default: true
    delay: 30000, // default: 15000
    maxRetries: 1 // default: 3
  }
};

const helper = new KohoApiHelper(kohoApiHelperOptions);
```

## Implemented methods and resources

The following api resources have been implemented:

- `contracts` Invoicing contracts
- `customers` Customers
- `customersCategories` Customer categories (asiakasryhmä)
- `customersGroups` Customer groups (erikoisryhmä)
- `employees` Employees
- `invoices` Invoices
- `persons` Customer contact persons
- `products` Products (product types)
- `projects` Projects
- `sales` Sales (pikakauppa)
- `notifications` Notifications
- `offers` Offers
- `customReports` Custom reports

### Getter examples

Each resource type has `getAll()` and `getById(1234)` getters (below examples with contracts):

```javascript
const contracts = await helper.contracts.getAll(); // array of contract instances
const contracts = await helper.contracts.getById(1234); // single contract instance
```

There are also some resource specific getters for customers:

```javascript
const customers = await helper.customers.getByName('Customer Oy');
const customers = await helper.customers.getByNumber(1234);
const customers = await helper.customers.getByOrganizationId('1234567-8');
```

Above result can also be achieved by calling `getAll()` with parameters:

```javascript
const customers = await helper.customers.getAll({ name: 'Customer Oy' });
const customers = await helper.customers.getAll({ number: 1234 });
const customers = await helper.customers.getAll({ organization_id: '1234567-8' });
```

Request query parameters can be passed freely. With call below you can find projects that have been updated after said date:

```javascript
const projects = await helper.projects.getAll({ updated_after: '2020-06-01' });
```

### Setter examples

Update by id:

```javascript
await helper.projects.updateById(1234, { name: 'New project name' });
```

Or by fetching resource first and using update method:

```javascript
const project = await helper.projects.getById(1234); // Get single project instance

await project.update({
  name: 'New project name'
});
```

:warning: **Warning!**

When updating custom_parameters you should always first fetch the resource and then make the update with existing custom_parameters as in example below. Otherwise you will write over existing custom_parameters.

```javascript
const customer = await helper.customers.getById(1234);

await customer.update({
  custom_parameters: {
    ...customer.custom_parameters, // assign existing parameters

    updated_parameter: 'Updated' // update other parameters
  }
});
```

You can also use patch_parameters for updating custom_parameters.

```javascript
await customer.update({
  patch_parameters: {
    updated_parameter: 'Updated'
  }
});
```

### Create example

Create new customer

```javascript
const customer = await helper.customers.create({
  name: 'Example Customer Oy',
  description: 'Customer generated by Koho Api Helper',
  organization_id: '1234567-8'
});
```

## Changelog

- 1.1.0 Add customersGroups and customersCategories resources
- 1.2.0 Add notifications
- 1.3.0 Add offers
- 1.4.0 Add productsCatalogs + code refactoring
- 1.5.0 Add customersFinancialStatements
- 1.6.0 Add accountingTargets, employeeProfiles, employeeTeams
- 1.7.0 Add workSessions, workSessionAssignments, workSessionAssignmentTemplates
- 1.8.0 Add customReports
- 1.9.0 Add workSessionShifts and workSessionShiftTypes, add new helper option useKeepAliveAgent
- 1.10.0 Add support for updating notifications, companies methods, accounting assignments methods and better error messages
- 2.0.0 Add streaming by default for GET requests to avoid throttling, can be disabled by disableStreaming option
- 2.1.0 Add support for offer notifications (extends notifications methods)
- 3.0.0 Update streaming and keepAliveAgent handling
- 3.0.3 Add projectTemplates (experimental)
- 3.1.0 Add throttle handling and throttleOptions to normal requests
- 4.0.0 Implement timeout
- 4.1.0 Add datafiles

## Miscellaneous examples

Update employee groups.

```javascript
await employee.update({
  group_ids: [1234, 123]
});
```
