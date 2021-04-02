/**
 * @File Name		: MonitorService.java
 * @Package   	: com.fanglin.monitor.service
 * @Version		: 1.0
 * @Date			: 2017-9-18
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.factory.service;

import java.util.List;

import com.fanglin.factory.vo.MonitorVO;

public interface MonitorService {
	
	public List<MonitorVO> queryMonitor();
	
	public int updateMonitor(MonitorVO monitorVO);

}
