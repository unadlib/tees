## About Reporter

### Server

This reporter use public repositories of `Report Portal`.

> [reportportal.io](http://reportportal.io/docs) here get more information.


### Integration

For integration we use the module [`client-javascript`](https://github.com/reportportal/client-javascript), we create a client connect every time you run the test, and it will send test information to the server in real time.

---

### Configuration

Here offers some configurations based on environment variables or a jest reporter key defined in reporter option. All configuration values should be **strings**.

| Variable Name | Description | Example 
|--|--|--|
| `REPORTER_TOKEN` | `Token` for connect to server.  | `"00000000-0000-0000-0000-000000000000"` 
| `REPORTER_END_POINT` | Server api address. | `"http://your-instance.com:8080/api/v1"`
| `REPORTER_PROJECT_NAME` | Project to connect. | `"project_name"`
| `REPORTER_LAUNCH_NAME` | Launch name will be create in this test. | `"launch_name"`
|`REPORTER_TAGS` | Tags for the launch, multiple tags are split by `,`. | `"tag1, tag2"` 

Or you can also define keys in your reporter option. All are string values.

```javascript
  {
  ...
  "your_reporter": {
    "token": "00000000-0000-0000-0000-000000000000",
    "endpoint": "http://your-instance.com:8080/api/v1",
    "project": "project_name",
    "launchname": "launch_name",
    "tags": "tag1, tag2",
  }
}
```