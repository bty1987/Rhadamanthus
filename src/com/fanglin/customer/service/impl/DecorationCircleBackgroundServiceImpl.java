package com.fanglin.customer.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.dao.DecorationCircleBackgroundDao;
import com.fanglin.customer.po.DecorationCircleBackgroundPO;
import com.fanglin.customer.service.DecorationCircleBackgroundService;
import com.fanglin.customer.vo.DecorationCircleBackgroundVO;
import com.fanglin.utils.BeanUtil;

@Service("decorationCircleBackgroundService")
@Transactional(readOnly=true)
public class DecorationCircleBackgroundServiceImpl implements DecorationCircleBackgroundService{
	
	@Autowired
	private DecorationCircleBackgroundDao decorationCircleBackgroundDao;
	
	@Override
	public DecorationCircleBackgroundVO queryDecorationCircleBackgroundByUnionId(DecorationCircleBackgroundVO decorationCircleBackgroundVO) {
		
		DecorationCircleBackgroundPO decorationCircleBackgroundPO = decorationCircleBackgroundDao.queryDecorationCircleBackgroundByUnionId(decorationCircleBackgroundVO.getUnionId());
		
		decorationCircleBackgroundVO = new DecorationCircleBackgroundVO();
		
		BeanUtil.copyPropertie(decorationCircleBackgroundPO, decorationCircleBackgroundVO);
		
		return decorationCircleBackgroundVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateDecorationCircleBackground(DecorationCircleBackgroundVO decorationCircleBackgroundVO) throws FLException {
		
		DecorationCircleBackgroundPO decorationCircleBackgroundPO = decorationCircleBackgroundDao.queryDecorationCircleBackgroundByUnionId(decorationCircleBackgroundVO.getUnionId());
		
		if(decorationCircleBackgroundPO == null){
			
			decorationCircleBackgroundPO = new DecorationCircleBackgroundPO();
			
			BeanUtil.copyPropertie(decorationCircleBackgroundVO, decorationCircleBackgroundPO);
			
			decorationCircleBackgroundDao.save(decorationCircleBackgroundPO);
			
		}else{
			
			decorationCircleBackgroundPO.setPath(decorationCircleBackgroundVO.getPath());
			
			decorationCircleBackgroundDao.update(decorationCircleBackgroundPO);
			
		}
		
		return 0;
	}

}
