/**
 * @File Name		: PutlineConstructionScheduleServiceImpl.java
 * @Package   	: com.fanglin.service.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-10-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.PutlineConstructionScheduleDao;
import com.fanglin.construction.po.PutlineConstructionSchedulePO;
import com.fanglin.construction.service.PutlineConstructionScheduleService;
import com.fanglin.construction.vo.PutlineConstructionScheduleVO;
import com.fanglin.drawline.dao.DrawLineDao;
import com.fanglin.drawline.po.DrawLinePO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("putlineConstructionScheduleService")
@Transactional(readOnly=true)
public class PutlineConstructionScheduleServiceImpl implements PutlineConstructionScheduleService {

	@Autowired
	private PutlineConstructionScheduleDao putlineConstructionScheduleDao;
	
	@Autowired
	private DrawLineDao drawLineDao;
	
	@Override
	public PutlineConstructionScheduleVO queryPutlineConstructionScheduleById(int pcsId){
		
		PutlineConstructionSchedulePO putlineConstructionSchedulePO = putlineConstructionScheduleDao.get(pcsId);
		PutlineConstructionScheduleVO putlineConstructionScheduleVO = new PutlineConstructionScheduleVO();
		
		BeanUtil.copyProperties(putlineConstructionSchedulePO, putlineConstructionScheduleVO, Arrays.asList("decorationOrder"));
		putlineConstructionScheduleVO.setOrderId(putlineConstructionSchedulePO.getOrderId());
		
		return putlineConstructionScheduleVO;
	}

	@Override
	public PutlineConstructionScheduleVO queryPutlineConstructionScheduleByOrderId(PutlineConstructionScheduleVO putlineConstructionScheduleVO){
		
		if(putlineConstructionScheduleVO == null){
			return null;
		}
		PutlineConstructionSchedulePO putlineConstructionSchedulePO = putlineConstructionScheduleDao.queryConstructionScheduleByOrderId(putlineConstructionScheduleVO.getOrderId());
		if(putlineConstructionSchedulePO != null){
			BeanUtil.copyProperties(putlineConstructionSchedulePO, putlineConstructionScheduleVO);
		}

		return putlineConstructionScheduleVO;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int saveOrUpdatePutlineConstructionSchedule(PutlineConstructionScheduleVO putlineConstructionScheduleVO){
		
		PutlineConstructionSchedulePO putlineConstructionSchedulePO = putlineConstructionScheduleDao.queryConstructionScheduleByOrderId(putlineConstructionScheduleVO.getOrderId());
		
		if(putlineConstructionSchedulePO == null){
			putlineConstructionSchedulePO = new	PutlineConstructionSchedulePO();
			putlineConstructionSchedulePO.setStartTime(DateUtil.current(PutlineConstructionSchedulePO.CURRENT_TIME_FORMAT_STR));
			putlineConstructionSchedulePO.setEndTime(DateUtil.current(PutlineConstructionSchedulePO.CURRENT_TIME_FORMAT_STR));
			putlineConstructionSchedulePO.setPutlineTime(DateUtil.current(PutlineConstructionSchedulePO.CURRENT_TIME_FORMAT_STR));
		}
		
		BeanUtil.copyProperties(putlineConstructionScheduleVO, putlineConstructionSchedulePO);
		putlineConstructionScheduleDao.saveOrUpdate(putlineConstructionSchedulePO);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setPutlineConstructionScheduleForStatus(PutlineConstructionScheduleVO putlineConstructionScheduleVO, String userId){
		
		int putlineStatus = putlineConstructionScheduleVO.getPutlineStatus();
		
		PutlineConstructionSchedulePO putlineConstructionSchedulePO = putlineConstructionScheduleDao.get(putlineConstructionScheduleVO.getPlcsId());
		
		if(putlineConstructionSchedulePO != null){
			putlineConstructionSchedulePO.setPutlineStatus(putlineStatus);
			
			List<DrawLinePO> drawLinePOs = drawLineDao.queryDrawLineByOrderId(putlineConstructionSchedulePO.getOrderId());
				
			if(drawLinePOs != null && drawLinePOs.size() > 0){
				
				DrawLinePO drawLinePO = drawLinePOs.get(0);
				
				if(putlineConstructionScheduleVO.getPutlineStatus() == PutlineConstructionSchedulePO.PUTLINESTATUS_TYPE_SUCCESS_INT){
					drawLinePO.setStatus("放线成功");
					
					List<String> dutys = new ArrayList<String>();
					dutys.add("前台咨询师");
				}else if(putlineConstructionScheduleVO.getPutlineStatus() == PutlineConstructionSchedulePO.PUTLINESTATUS_TYPE_FAIL_INT){
					drawLinePO.setStatus("放线失败");
				}
				
				drawLineDao.update(drawLinePO);
			}
			
			putlineConstructionScheduleDao.update(putlineConstructionSchedulePO);
		}
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setPutlineConstructionScheduleForInfo(PutlineConstructionScheduleVO putlineConstructionScheduleVO){
		
		PutlineConstructionSchedulePO putlineConstructionSchedulePO = putlineConstructionScheduleDao.get(putlineConstructionScheduleVO.getPlcsId());
		
		if(putlineConstructionSchedulePO != null){
			putlineConstructionSchedulePO.setPutlineTime(putlineConstructionScheduleVO.getPutlineTime());
			
			putlineConstructionScheduleDao.update(putlineConstructionSchedulePO);
		}
	}

}
