import {Snowflake} from "nodejs-snowflake";

const uid = new Snowflake({
  custom_epoch: 0,
  instance_id: 1,
});

export default uid;