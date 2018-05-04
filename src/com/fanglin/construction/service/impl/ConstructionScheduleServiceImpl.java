package com.fanglin.construction.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.ConstructionNodeDao;
import com.fanglin.communion.po.ConstructionNodePO;
import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.dao.DrawLineDao;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.construction.po.DrawLinePO;
import com.fanglin.construction.service.ConstructionScheduleService;
import com.fanglin.construction.vo.ConstructionScheduleVO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.utils.BeanUtil;

@Service("constructionScheduleService")
@Transactional(readOnly=true)
public class ConstructionScheduleServiceImpl implements ConstructionScheduleService {
	
	@Autowired
	private DecorationDao decorationDao;
	
	@Autowired
	private ConstructionNodeDao constructionNodeDao;
	
	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;
	
	@Autowired
	private ConstructionDao constructionDao;
	
	@Autowired
	private DrawLineDao drawLineDao;

	@Override
	public List<ConstructionScheduleVO> queryConstructionScheduleByOrderId(ConstructionScheduleVO constructionScheduleVO) {
		
		String orderId = constructionScheduleVO.getOrderId();
		Short schedule = constructionScheduleVO.getSchedule();
		
		List<ConstructionSchedulePO> constructionSchedulePOs = constructionScheduleDao.queryConstructionScheduleByOrderId(orderId, schedule);
		List<ConstructionScheduleVO> constructionScheduleVOs = new ArrayList<ConstructionScheduleVO>();
		
		for (ConstructionSchedulePO constructionSchedulePO : constructionSchedulePOs) {
			if(constructionSchedulePO != null){
				ConstructionScheduleVO constructionSchedule = new ConstructionScheduleVO();
				BeanUtil.copyProperties(constructionSchedulePO, constructionSchedule);
				constructionScheduleVOs.add(constructionSchedule);
			}
		}
		
		return constructionScheduleVOs;
	}
	
	@Override
	public List<ConstructionScheduleVO> queryConstructionScheduleByCid(ConstructionScheduleVO constructionScheduleVO) {
		
		Long cid = constructionScheduleVO.getCid();
		Short schedule = constructionScheduleVO.getSchedule();
		
		List<ConstructionSchedulePO> constructionSchedulePOs = constructionScheduleDao.queryConstructionScheduleByCid(cid, schedule);
		List<ConstructionScheduleVO> constructionScheduleVOs = new ArrayList<ConstructionScheduleVO>();
		
		for (ConstructionSchedulePO constructionSchedulePO : constructionSchedulePOs) {
			if(constructionSchedulePO != null){
				ConstructionScheduleVO constructionSchedule = new ConstructionScheduleVO();
				BeanUtil.copyProperties(constructionSchedulePO, constructionSchedule);
				constructionScheduleVOs.add(constructionSchedule);
			}
		}
		
		return constructionScheduleVOs;
	}
	
	
	@Override
	@SuppressWarnings("static-access")
	@Transactional(rollbackFor=Exception.class)
	public void setConstructionScheduleForStatus(ConstructionScheduleVO constructionScheduleVO) {

		short status = constructionScheduleVO.getStatus();
		
		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(constructionScheduleVO.getCsId());
		ConstructionPO _constructionPO = constructionDao.queryConstructionByOrderId(constructionScheduleVO.getOrderId());
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(constructionSchedulePO.getOrderId());
		
		Short projectStatus = decorationPO.getProjectStatus();
		Short schedule = constructionSchedulePO.getSchedule();
		
		ConstructionNodePO _constructionNodePO = constructionNodeDao.get((long)(constructionSchedulePO.getSchedule()));
		
		if(projectStatus != decorationPO.PROJECTSTATUS_FINISH_INT){
			if(projectStatus < _constructionNodePO.getSort()){
				
					decorationPO.setProjectStatus((short)schedule);
					decorationDao.update(decorationPO);
					
					if(_constructionPO != null){
						_constructionPO.setSchedule(schedule);
						constructionDao.update(_constructionPO);
					}
					
			}
		}
		
		if(constructionSchedulePO != null){
			constructionSchedulePO.setStatus(status);
			
			if(constructionSchedulePO.getSchedule() == ConstructionSchedulePO.COLUMN_SCHEDULE_ONE){
				ConstructionPO constructionPO = constructionDao.get(constructionSchedulePO.getCid());
				if(constructionPO != null){
					constructionScheduleDao.update(constructionSchedulePO);
					
				}
				
				if(status == ConstructionSchedulePO.STATUS_TYPE_FAIL_INT){
					List<DrawLinePO> drawLinePOs  = drawLineDao.queryDrawLineByOrderId(constructionSchedulePO.getOrderId());
					if(drawLinePOs != null && drawLinePOs .size() > 0){
						drawLinePOs.get(0).setStatus("放线失败");
						drawLineDao.update(drawLinePOs.get(0));
					}
				}
			}
			
			if(constructionSchedulePO.getSchedule() == ConstructionSchedulePO.COLUMN_SCHEDULE_TWO){
				List<DrawLinePO> drawLinePOs = drawLineDao.queryDrawLineByOrderId(constructionSchedulePO.getOrderId());
				
				if(drawLinePOs != null && drawLinePOs.size() > 0){
					
					DrawLinePO drawLinePO = drawLinePOs.get(0);
					
					if(constructionScheduleVO.getStatus() == ConstructionSchedulePO.STATUS_TYPE_SUCCESS_INT){
						drawLinePO.setStatus("放线成功");
						
					}else if(constructionScheduleVO.getStatus() == ConstructionSchedulePO.STATUS_TYPE_FAIL_INT){
						drawLinePO.setStatus("放线失败");
					}
					
					drawLineDao.update(drawLinePO);
				}
			}
			
			constructionScheduleDao.update(constructionSchedulePO);
		}
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setConstructionScheduleForInfo(ConstructionScheduleVO constructionScheduleVO) {

		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(constructionScheduleVO.getCsId());
		
		constructionSchedulePO.setStartTime(constructionScheduleVO.getStartTime());
		constructionSchedulePO.setEndTime(constructionScheduleVO.getEndTime());
		
		constructionScheduleDao.update(constructionSchedulePO);
		
	}

}
