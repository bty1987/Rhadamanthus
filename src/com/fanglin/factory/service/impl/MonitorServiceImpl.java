/**
 * @File Name		: MonitorServiceImpl.java
 * @Package   	: com.fanglin.monitor.service.impl
 * @Version		: 1.0
 * @Date			: 2017-9-18
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.factory.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.factory.dao.MonitorDao;
import com.fanglin.factory.po.MonitorPO;
import com.fanglin.factory.service.MonitorService;
import com.fanglin.factory.vo.MonitorVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("monitorService")
@Transactional(readOnly=true)
public class MonitorServiceImpl implements MonitorService {
	
	@Autowired
	private MonitorDao monitorDao;

	@Override
	public List<MonitorVO> queryMonitor() {
		
		List<MonitorPO> monitorPOs = monitorDao.queryMonitor();
		List<MonitorVO> monitorVOs = new ArrayList<MonitorVO>();
		
		MonitorVO monitorVO;
		
		for(MonitorPO monitorPO: monitorPOs){
			
			monitorVO = new MonitorVO();
			
			BeanUtil.copyProperties(monitorPO, monitorVO);
			
			monitorVOs.add(monitorVO);
		}
		
		return monitorVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateMonitor(MonitorVO monitorVO) {
		
		MonitorPO monitorPO = monitorDao.queryMonitor(monitorVO.getName(), monitorVO.getType());
		
		if(monitorPO == null){
			monitorPO = new MonitorPO(monitorVO.getName(), monitorVO.getHost(), monitorVO.getType(), monitorVO.getComment());
		}
		
		if(monitorVO.getStatus() == MonitorPO.STATUS_SUCCESS_INT){
			monitorPO.setStatus(MonitorPO.STATUS_SUCCESS_INT);
			monitorPO.setCount(0);
		}else if(monitorVO.getStatus() == MonitorPO.STATUS_FAIL_INT){
			monitorPO.setStatus(MonitorPO.STATUS_FAIL_INT);
			monitorPO.setCount(monitorPO.getCount() + 1);
		}
		
		monitorPO.setValue(monitorVO.getValue());
		monitorPO.setComment(monitorVO.getComment());
		monitorPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
		
		monitorDao.saveOrUpdate(monitorPO);
			
		return 0;
	}

}
