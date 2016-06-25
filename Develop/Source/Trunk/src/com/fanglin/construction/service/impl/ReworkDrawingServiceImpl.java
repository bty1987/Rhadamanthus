/**
 * @File Name		: ReworkDrawingServiceImpl.java
 * @Package   	: com.fanglin.service.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.ReworkDrawingDao;
import com.fanglin.construction.po.ReworkDrawingPO;
import com.fanglin.construction.service.ReworkDrawingService;
import com.fanglin.construction.vo.ReworkDrawingVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("reworkDrawingService")
@Transactional(readOnly=true)
public class ReworkDrawingServiceImpl implements ReworkDrawingService {
	
	@Autowired
	private ReworkDrawingDao reworkDrawingDao;

	@Override
	public List<ReworkDrawingVO> queryDrawingByReworkId(ReworkDrawingVO reworkDrawingVO){
		
		List<ReworkDrawingPO> reworkDrawingPOs = reworkDrawingDao.queryDrawingByReworkId(reworkDrawingVO.getRwId());
		List<ReworkDrawingVO> reworkDrawingVOs = new ArrayList<ReworkDrawingVO>();
		
		for(ReworkDrawingPO reworkDrawingPO: reworkDrawingPOs){
			ReworkDrawingVO _reworkDrawingVO = new ReworkDrawingVO();
			BeanUtil.copyProperties(reworkDrawingPO, _reworkDrawingVO);
			reworkDrawingVOs.add(_reworkDrawingVO);
		}
		
		return reworkDrawingVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteReworkDrawingById(ReworkDrawingVO reworkDrawingVO){
		reworkDrawingDao.deleteById(reworkDrawingVO.getRwdId());
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int saveOrUpdateReworkDrawing(ReworkDrawingVO reworkDrawingVO, String userName){
		
		ReworkDrawingPO reworkDrawingPO = new ReworkDrawingPO();
		BeanUtil.copyProperties(reworkDrawingVO, reworkDrawingPO);
		reworkDrawingPO.setOperatorName(userName);
		reworkDrawingPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		
		reworkDrawingDao.saveOrUpdate(reworkDrawingPO);
		reworkDrawingDao.refresh(reworkDrawingPO);
		
		return reworkDrawingPO.getRwdId();
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteReworkDrawingByReworkId(List<String> rwIds){
		
		for(String rwId: rwIds){
			List<ReworkDrawingPO> reworkDrawingPOs = reworkDrawingDao.queryDrawingByReworkId(Integer.valueOf(rwId));
			for(ReworkDrawingPO reworkDrawingPO: reworkDrawingPOs){
				reworkDrawingDao.delete(reworkDrawingPO);
			}
		}
	}
	
}
