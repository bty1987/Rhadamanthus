/**
 * @File Name		: ChanConstructionScheduleServiceImpl.java
 * @Package   	: com.fanglin.service.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.ChanConstructionScheduleDao;
import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.po.ChanConstructionSchedulePO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.construction.service.ChanConstructionScheduleService;
import com.fanglin.construction.vo.ChanConstructionScheduleVO;
import com.fanglin.drawline.dao.DrawLineDao;
import com.fanglin.drawline.po.DrawLinePO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("chanConstructionScheduleService")
@Transactional(readOnly=true)
public class ChanConstructionScheduleServiceImpl implements ChanConstructionScheduleService {
	
	@Autowired
	private ChanConstructionScheduleDao chanConstructionScheduleDao;
	
	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;
	
	@Autowired
	private DrawLineDao drawLineDao;
	
	@Override
	public ChanConstructionScheduleVO queryChanConstructionScheduleById(int ccsId){
		
		ChanConstructionSchedulePO chanConstructionSchedulePO = chanConstructionScheduleDao.get(ccsId);
		ChanConstructionScheduleVO chanConstructionScheduleVO = new ChanConstructionScheduleVO();
		
		BeanUtil.copyProperties(chanConstructionSchedulePO, chanConstructionScheduleVO);
		
		return chanConstructionScheduleVO;
	}

	@Override
	public ChanConstructionScheduleVO queryChanConstructionScheduleByOrderId(ChanConstructionScheduleVO chanConstructionScheduleVO){
		
		ChanConstructionSchedulePO chanConstructionSchedulePO = chanConstructionScheduleDao.queryChanConstructionScheduleByOrderId(chanConstructionScheduleVO.getOrderId());
		
		if(chanConstructionSchedulePO != null){
			BeanUtil.copyProperties(chanConstructionSchedulePO, chanConstructionScheduleVO);
		}
		
		return chanConstructionScheduleVO;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int saveOrUpdateChanConstructionSchedule(ChanConstructionScheduleVO chanConstructionScheduleVO){
		
		ChanConstructionSchedulePO chanConstructionSchedulePO = chanConstructionScheduleDao.queryChanConstructionScheduleByOrderId(chanConstructionScheduleVO.getOrderId());
		
		if(chanConstructionScheduleDao == null){
			chanConstructionSchedulePO = new ChanConstructionSchedulePO();
			chanConstructionSchedulePO.setStartTime(DateUtil.current(ChanConstructionSchedulePO.CURRENT_TIME_FORMAT_STR));
			chanConstructionSchedulePO.setEndTime(DateUtil.current(ChanConstructionSchedulePO.CURRENT_TIME_FORMAT_STR));
		}
		
		BeanUtil.copyProperties(chanConstructionScheduleVO, chanConstructionSchedulePO);
		chanConstructionScheduleDao.saveOrUpdate(chanConstructionSchedulePO);
		
		return chanConstructionSchedulePO.getCcsId();

	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setChanConstructionScheduleForTimeFlag(ChanConstructionScheduleVO chanConstructionScheduleVO){
		
		ChanConstructionSchedulePO chanConstructionSchedulePO = chanConstructionScheduleDao.get(chanConstructionScheduleVO.getCcsId());
		
		chanConstructionSchedulePO.setEndTimeFlag(chanConstructionScheduleVO.getEndTimeFlag());
		chanConstructionSchedulePO.setStartTimeFlag(chanConstructionScheduleVO.getStartTimeFlag());
		
		chanConstructionScheduleDao.update(chanConstructionSchedulePO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setChanConstructionScheduleForStatus(ChanConstructionScheduleVO chanConstructionScheduleVO){
		
		int status = chanConstructionScheduleVO.getStatus();
		
		ChanConstructionSchedulePO chanConstructionSchedulePO = chanConstructionScheduleDao.get(chanConstructionScheduleVO.getCcsId());
		
		if(chanConstructionSchedulePO != null){
			chanConstructionSchedulePO.setStatus(status);
			
			ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(chanConstructionSchedulePO.getCsId());
			if(constructionSchedulePO != null){
				constructionSchedulePO.setChanStatus(status);
				constructionScheduleDao.update(constructionSchedulePO);
			}
			
			if(status == ChanConstructionSchedulePO.STATUS_TYPE_FAIL_INT){
				List<DrawLinePO> drawLinePOs  = drawLineDao.queryDrawLineByOrderId(chanConstructionSchedulePO.getOrderId());
				if(drawLinePOs != null && drawLinePOs .size() > 0){
					drawLinePOs.get(0).setStatus("放线失败");
					drawLineDao.update(drawLinePOs.get(0));
				}
			}
			
			chanConstructionScheduleDao.update(chanConstructionSchedulePO);
		}
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setChanConstructionScheduleForInfo(ChanConstructionScheduleVO chanConstructionScheduleVO){
		
		ChanConstructionSchedulePO chanConstructionSchedulePO = chanConstructionScheduleDao.get(chanConstructionScheduleVO.getCcsId());
		
		if(chanConstructionSchedulePO != null){
			chanConstructionSchedulePO.setEndTime(chanConstructionScheduleVO.getEndTime());
			chanConstructionSchedulePO.setStartTime(chanConstructionScheduleVO.getStartTime());
			
			chanConstructionScheduleDao.update(chanConstructionSchedulePO);
		}
	}

}
