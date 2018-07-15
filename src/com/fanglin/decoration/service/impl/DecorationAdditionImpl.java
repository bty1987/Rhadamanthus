package com.fanglin.decoration.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.decoration.dao.DecorationAdditionDao;
import com.fanglin.decoration.po.DecorationAdditionPO;
import com.fanglin.decoration.service.DecorationAdditionService;
import com.fanglin.decoration.vo.DecorationAdditionVO;
import com.fanglin.utils.BeanUtil;

@Service("decorationAdditionService")
@Transactional(readOnly=true)
public class DecorationAdditionImpl implements DecorationAdditionService{

	@Autowired
	private DecorationAdditionDao decorationAdditionDao;
	
	@Override
	public DecorationAdditionVO queryDecorationAdditionByOrderId(DecorationAdditionVO decorationAdditionVO) {
		
		DecorationAdditionPO decorationAdditionPO = decorationAdditionDao.queryDecorationAdditionByOrderId(decorationAdditionVO.getOrderId());
		decorationAdditionVO = new DecorationAdditionVO();

		BeanUtil.copyProperties(decorationAdditionPO, decorationAdditionVO);
		
		return decorationAdditionVO;
	}

}
