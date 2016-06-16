package com.fanglin.timer;

import java.util.Calendar;
import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 这是一个打铃的程序，必须隔一段时间打一次
 * @author sam
 */
public class FlTimerTask extends TimerTask {
	
	protected Logger log = LoggerFactory.getLogger(getClass());
	
	public FlTimerTask(){
	}

	public FlTimerTask(int s, int d){
		this.second = s;
		this.delay = d;
	}

	int second = 1;
	int delay = 1;

	public void setSecond(int second){
		this.second = second;
	}

	public void setDelay(int delay){
		this.delay = delay;
	}
	
	@Override
	public void run(){
		Date date = new Date();
		
		Calendar c = Calendar.getInstance();
		c.setTime(date);
		
		if(c.get(Calendar.HOUR_OF_DAY)==0 && c.get(Calendar.MINUTE)<=15){
			
			try{
				log.info("检查客户回访启动 --"+(new Date()).toString());
//				backVisitService.remindBackVisitForDesigner();
			}catch (Exception e){
				log.info("检查客户回访失败 --"+(new Date()).toString());
			}
		}
	}
	
	public static void main(String[] args){
		// 以 java定时器的模式调用
		Timer timer = new Timer();
		timer.schedule(new FlTimerTask(3, 3), 3000, 3000); // 需要注册的定时类 最开始先延迟3秒的时间 每隔3秒的时间调用一次
	}
}
