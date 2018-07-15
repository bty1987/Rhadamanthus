package com.fanglin.decoration.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.dao.impl.DecorationAccountDaoImpl;
import com.fanglin.decoration.po.DecorationAccountPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationAccountService;
import com.fanglin.decoration.vo.DecorationAccountVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;


@Service("decorationAccountService")
@Transactional(readOnly=true)
public class DecorationAccountServiceImpl implements DecorationAccountService{

	@Autowired
	private DecorationAccountDaoImpl decorationAccountDao;
	
	@Autowired
	private DecorationDao decorationDao;
	
	@Override
	public DecorationAccountVO queryDecorationAccount(DecorationAccountVO decorationAccountVO) {
		
		DecorationAccountPO decorationAccountPO = decorationAccountDao.queryDecorationAccount(decorationAccountVO.getOrderId());
		
		decorationAccountVO = new DecorationAccountVO();
		
		BeanUtil.copyPropertie(decorationAccountPO, decorationAccountVO);
		
		return decorationAccountVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void makeDecorationAccount(DecorationAccountVO decorationAccountVO) throws FLException {
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationAccountVO.getOrderId());
		
		if(decorationPO.getStatus() != DecorationPO.STATUS_SIGNED_INT){
			throw new FLException(140004,"装修单状态不可操作");
		}
		
		decorationPO.setStatus(DecorationPO.STATUS_FINAL_INT);
		decorationDao.update(decorationPO);
		
		DecorationAccountPO decorationAccountPO = new DecorationAccountPO();
		
		Float materialPrice = (float) Math.ceil(Arith.mul(decorationAccountVO.getProjectPrice(), decorationAccountVO.getMaching()));
		Float servicePrice = (float) Math.floor(Arith.mul(materialPrice, decorationAccountVO.getServiceRate()));
		
		BeanUtil.copyProperties(decorationAccountVO,decorationAccountPO);
		
		decorationAccountPO.setMaterialPrice(materialPrice);
		decorationAccountPO.setType(decorationPO.getType());
		decorationAccountPO.setServicePrice(servicePrice);
		
		decorationAccountDao.save(decorationAccountPO);
		
	}

}
