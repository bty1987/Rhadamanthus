package com.fanglin.data.quotation.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.data.po.PresignCostPO;
import com.fanglin.data.quotation.dao.PresignCostDao;
import com.fanglin.data.quotation.service.PresignCostService;
import com.fanglin.data.quotation.vo.PresignCostVO;
import com.fanglin.utils.BeanUtil;

@Service("presignCostService")
@Transactional(readOnly = true)
public class PresignCostServiceImpl implements PresignCostService {

	@Autowired
	private PresignCostDao presignCostDao;
	
	@Override
	public List<PresignCostVO> queryPresignCost(PresignCostVO presignCost) {

		List<PresignCostPO> presignCostPOs = presignCostDao.queryPresignCost(presignCost.getPpid());
		List<PresignCostVO> presignCostVOs = new ArrayList<PresignCostVO>();
		
		for(PresignCostPO presignCostPO : presignCostPOs){
			PresignCostVO presignCostVO = new PresignCostVO();
			BeanUtil.copyProperties(presignCostPO, presignCostVO);
			presignCostVOs.add(presignCostVO);
		}
		
		return presignCostVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addPresignCost(PresignCostVO presignCostVO) {
		
		PresignCostPO presignCostPO = new PresignCostPO();
		
		BeanUtil.copyProperties(presignCostVO, presignCostPO);
		
		presignCostDao.save(presignCostPO);
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deletePresignCost(PresignCostVO presignCost) {
		
		PresignCostPO presignCostPO = presignCostDao.get(presignCost.getPcid());

		presignCostDao.delete(presignCostPO);
		
		return 0;
	}
	
}
