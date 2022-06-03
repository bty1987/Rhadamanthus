package com.fanglin.balance.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.balance.dao.BalanceCutpayDao;
import com.fanglin.balance.dao.BalanceDao;
import com.fanglin.balance.po.BalanceCutpayPO;
import com.fanglin.balance.po.BalancePO;
import com.fanglin.balance.service.BalanceCutpayService;
import com.fanglin.balance.vo.BalanceCutpayVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("balanceCutpayService")
@Transactional(readOnly = true)
public class BalanceCutpayServicerImpl implements BalanceCutpayService {

	@Autowired
	private BalanceCutpayDao balanceCutpayDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private BalanceDao balanceDao;

	@Override
	public List<BalanceCutpayVO> queryBalanceCutpay(BalanceCutpayVO balanceCutpayVO) {
		
		List<BalanceCutpayPO> balanceCutpayPOs = balanceCutpayDao.queryBalanceCutpay(balanceCutpayVO.getBalance().getBid());
		List<BalanceCutpayVO> balanceCutpayVOs = new ArrayList<BalanceCutpayVO>();

		for (BalanceCutpayPO balanceCutpayPO : balanceCutpayPOs) {

			balanceCutpayVO = new BalanceCutpayVO(new UserBaseVO());

			BeanUtil.copyPropertie(balanceCutpayPO, balanceCutpayVO,Arrays.asList("operater","balance"));
			BeanUtil.copyPropertie(balanceCutpayPO.getOperater(),balanceCutpayVO.getOperater(), Arrays.asList("duty", "dept"));

			balanceCutpayVOs.add(balanceCutpayVO);
		}

		return balanceCutpayVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addBalanceCutpay(BalanceCutpayVO balanceCutpayVO, String userId) throws FLException {
		
		BalancePO balancePO = balanceDao.get(balanceCutpayVO.getBalance().getBid());

		if (balancePO == null) {
			throw new FLException(350006, "结算单不存在");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		BalanceCutpayPO balanceCutpayPO = new BalanceCutpayPO();
		
		balanceCutpayPO.setBalance(balancePO);
		balanceCutpayPO.setOperater(operater);
		balanceCutpayPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		balanceCutpayPO.setMoney(balanceCutpayVO.getMoney());
		balanceCutpayPO.setType(balanceCutpayVO.getType());
		balanceCutpayPO.setComment(balanceCutpayVO.getComment());

		if (balanceCutpayPO.getType() == balanceCutpayPO.TYPE_CUTPAY_INT){
			balanceCutpayPO.setCutpay(Arith.add(balancePO.getCutpay(), balanceCutpayPO.getMoney()));
		} else {
			balanceCutpayPO.setCutpay(Arith.sub(balancePO.getCutpay(), balanceCutpayPO.getMoney()));
		}
		
		balanceCutpayDao.save(balanceCutpayPO);
		
		balancePO.setCutpay(balanceCutpayPO.getCutpay());
		
		balanceDao.update(balancePO);

		return 0;
	}

}
