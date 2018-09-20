package com.fanglin.decoration.service.impl;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Authentication;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.dao.DecorationOperateDao;
import com.fanglin.decoration.dao.impl.DecorationAccountDaoImpl;
import com.fanglin.decoration.po.DecorationAccountPO;
import com.fanglin.decoration.po.DecorationOperatePO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationAccountService;
import com.fanglin.decoration.vo.DecorationAccountVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;


@Service("decorationAccountService")
@Transactional(readOnly=true)
public class DecorationAccountServiceImpl implements DecorationAccountService{

	@Autowired
	private DecorationAccountDaoImpl decorationAccountDao;
	
	@Autowired
	private DecorationDao decorationDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private DecorationOperateDao decorationOperateDao;
	
	@Override
	public DecorationAccountVO queryDecorationAccount(DecorationAccountVO decorationAccountVO) {
		
		DecorationAccountPO decorationAccountPO = decorationAccountDao.queryDecorationAccount(decorationAccountVO.getOrderId());
		
		decorationAccountVO = new DecorationAccountVO();
		
		BeanUtil.copyPropertie(decorationAccountPO, decorationAccountVO);
		
		return decorationAccountVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void makeDecorationAccount(DecorationAccountVO decorationAccountVO,Authentication authentication) throws FLException {
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationAccountVO.getOrderId());
		
		if(decorationPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		UserPO operater = userDao.queryUserByUserId(authentication.getUserId());
		
		if(decorationPO.getStatus() != DecorationPO.STATUS_SIGNED_INT){
			throw new FLException(140004,"装修单状态不可操作");
		}
		
		decorationPO.setStatus(DecorationPO.STATUS_FINAL_INT);
		decorationPO.setAccountTime(DateUtil.getDateToTimestamp(new Date()));
		decorationDao.update(decorationPO);
		
		DecorationAccountPO decorationAccountPO = new DecorationAccountPO();
		
		Float servicePrice = (float) Math.floor(Arith.mul(decorationAccountVO.getMaterialPrice(), decorationAccountVO.getServiceRate()));
		
		BeanUtil.copyProperties(decorationAccountVO,decorationAccountPO);
		
		decorationAccountPO.setMaterialPrice(decorationAccountVO.getMaterialPrice());
		decorationAccountPO.setType(decorationAccountVO.getType());
		decorationAccountPO.setServicePrice(servicePrice);
		
		decorationAccountDao.save(decorationAccountPO);
		
		DecorationOperatePO accountDecorationOperatePO = new DecorationOperatePO();
		accountDecorationOperatePO.setOrderId(decorationAccountVO.getOrderId());
		accountDecorationOperatePO.setOperater(operater);
		accountDecorationOperatePO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		accountDecorationOperatePO.setType(DecorationOperatePO.TYPE_ACCOUNT_DECORATION_ORDER_INT);
		accountDecorationOperatePO.setStatus(DecorationOperatePO.STATUS_INIT_INT);
		accountDecorationOperatePO.setComment("决算操作");
		decorationOperateDao.save(accountDecorationOperatePO);
		
	}

}
