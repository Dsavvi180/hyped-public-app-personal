import { Card, Metric, Text } from '@tremor/react';
import { useSignal, useComputed } from '@preact/signals-react';
import { useEffect, useState } from 'react';
import { Badge, BadgeDelta, Callout } from '@tremor/react';
import { useQuery } from 'react-query';
import { useRef } from 'react';
import { getUnixTime } from 'date-fns';
import { start } from 'repl';

export function DigitalTimer(): JSX.Element {
  const { data } = useQuery(
    'launch-time',
    async () =>
      (await fetch(
        `${process.env.NEXT_PUBLIC_TELEMETRY_SERVER}/pods/pod_1/public-data/launch-time`,
      ).then(res => res.json())) as any,
    {
      refetchInterval: 1000,
    },
  );

  // const [time, setTime] = useState<any>(-1);
  // const launchTime = data?.launchTime || -1;

  // useEffect(() => {
  //   const currentTime = new Date().getTime();
  //   const serverStartTime = data?.launchTime;
  //   const startTime = (currentTime - serverStartTime) / 1000;

  //   setTime(launchTime == -1 ? -1 : startTime);
  // }, [launchTime]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTime(time => (time == -1 ? time : time + 1));
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);

  const launchTime = data?.launchTime || -1;
  console.log(launchTime);

  const [time, setTime] = useState(-1);

  useEffect(() => {
    const d = new Date();
    const now = d.getTime();
    console.log(now);
    setTime(launchTime == -1 ? -1 : (now - launchTime) / 1000);
  }, [launchTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(time => (time == -1 ? time : time + 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  console.log(time);

  return (
    <Card
      // className="max-w-xs mx-auto"
      decoration="top"
      decorationColor="red"
    >
      <div className="timer">
        <div>
          <Text>Time since launch</Text>
          <Metric>
            {time > -1
              ? `${Math.floor(time / 60)}m ${Math.floor(time % 60)}s`
              : 'Not launched yet'}
          </Metric>
        </div>

        <div>
          <BadgeDelta
            size="lg"
            deltaType={launchTime > 0 ? 'moderateIncrease' : 'moderateDecrease'}
          >
            {launchTime > 0 ? 'LIVE' : 'Not Launched'}
          </BadgeDelta>
        </div>
      </div>
      {/* <div className="flex flex-row flex-wrap gap-3">
        {' '}
        <Callout
          className="h-15 mt-3"
          title="Status: Deployed but not running"
          // icon={ExclamationIcon}
          color="rose"
        >
          Unknown error present. Consult technical team.
        </Callout>
        <Callout
          className="h-15 mt-3"
          title="Status: System online"
          // icon={ExclamationIcon}
          color="green"
        ></Callout>
        <Callout
          className="h-15 mt-3"
          title="Status: Pod Stationary"
          // icon={ExclamationIcon}
          color="green"
        ></Callout>
      </div> */}
    </Card>
  );
}
