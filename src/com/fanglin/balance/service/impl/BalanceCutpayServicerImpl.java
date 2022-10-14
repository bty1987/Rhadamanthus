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
import com.fanglin.balance.dao.BalanceDccountDao;
import com.fanglin.balance.po.BalanceCutpayPO;
import com.fanglin.balance.po.BalanceDccountPO;
import com.fanglin.balance.po.BalancePO;
import com.fanglin.balance.service.BalanceCutpayService;
import com.fanglin.balance.vo.BalanceCutpayVO;
import com.fanglin.balance.vo.BalanceDccountVO;
import com.fanglin.balance.vo.BalanceVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("balanceCutpayService")
@Transactional(readOnly = true)
public class BalanceCutpayServicerImpl implements BalanceCutpayService {

	@Autowired
	private BalanceCutpayDao balanceCutpayDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private BalanceDao balanceDao;

	@Autowired
	private BalanceDccountDao balanceDccountDao;

	@Override
	public List<BalanceCutpayVO> queryBalanceCutpay(BalanceCutpayVO balanceCutpayVO) {

		List<BalanceCutpayPO> balanceCutpayPOs = balanceCutpayDao.queryBalanceCutpay(balanceCutpayVO.getBalance().getBid());
		List<BalanceCutpayVO> balanceCutpayVOs = new ArrayList<BalanceCutpayVO>();

		for (BalanceCutpayPO balanceCutpayPO : balanceCutpayPOs) {

			balanceCutpayVO = new BalanceCutpayVO(new BalanceVO(), new UserBaseVO(), new BalanceDccountVO(), new BalanceCutpayVO());

			BeanUtil.copyPropertie(balanceCutpayPO, balanceCutpayVO,Arrays.asList("operater", "balance", "cutpay", "dccount"));
			BeanUtil.copyPropertie(balanceCutpayPO.getOperater(),balanceCutpayVO.getOperater(), Arrays.asList("duty", "dept"));
			BeanUtil.copyPropertie(balanceCutpayPO.getBalance(),balanceCutpayVO.getBalance());
			BeanUtil.copyPropertie(balanceCutpayPO.getDccount(),balanceCutpayVO.getDccount());
			BeanUtil.copyPropertie(balanceCutpayPO.getCutpay(),balanceCutpayVO.getCutpay());

			balanceCutpayVOs.add(balanceCutpayVO);
		}

		return balanceCutpayVOs;
	}

	@Override
	public void pageBalanceCutpay(Paging paging, List<Filter> filters, BalanceCutpayVO balanceCutpayVO) {

		List<BalanceCutpayPO> balanceCutpayPOs = balanceCutpayDao.pageBalanceCutpay(paging, filters, balanceCutpayVO.getDccount().getBdid());
		List<BalanceCutpayVO> balanceCutpayVOs = new ArrayList<BalanceCutpayVO>();

		for (BalanceCutpayPO balanceCutpayPO : balanceCutpayPOs) {

			balanceCutpayVO = new BalanceCutpayVO(new BalanceVO(), new UserBaseVO());

			BeanUtil.copyPropertie(balanceCutpayPO, balanceCutpayVO,Arrays.asList("operater", "balance"));
			BeanUtil.copyPropertie(balanceCutpayPO.getOperater(),balanceCutpayVO.getOperater(), Arrays.asList("duty", "dept"));
			BeanUtil.copyPropertie(balanceCutpayPO.getBalance(),balanceCutpayVO.getBalance());
			BeanUtil.copyPropertie(balanceCutpayPO,balanceCutpayVO);

			balanceCutpayVOs.add(balanceCutpayVO);
		}

		paging.setData(balanceCutpayVOs);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addBalanceCutpay(BalanceCutpayVO balanceCutpayVO, String userId) throws FLException {

		BalancePO balancePO = balanceDao.get(balanceCutpayVO.getBalance().getBid());

		if (balancePO == null) {
			throw new FLException(350006, "结算单不存在");
		}

		if (balancePO.getSurplus() < balanceCutpayVO.getMoney()) {
			throw new FLException(350003, "结算单金额不足");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		BalanceCutpayPO balanceCutpayPO = new BalanceCutpayPO();

		balanceCutpayPO.setName(balanceCutpayVO.getName());
		balanceCutpayPO.setBalance(balancePO);
		balanceCutpayPO.setOperater(operater);
		balanceCutpayPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		balanceCutpayPO.setMoney(balanceCutpayVO.getMoney());
		balanceCutpayPO.setType(balanceCutpayVO.getType());
		balanceCutpayPO.setComment(balanceCutpayVO.getComment());

		if (balanceCutpayPO.getType() == balanceCutpayPO.TYPE_CUTPAY_INT){
			balanceCutpayPO.setTotal(Arith.add(balancePO.getCutpay(), balanceCutpayPO.getMoney()));
		} else {
			balanceCutpayPO.setTotal(Arith.sub(balancePO.getCutpay(), balanceCutpayPO.getMoney()));
		}

		if (balanceCutpayVO.getDccount() != null) {

			BalanceDccountPO balanceDccountPO = balanceDccountDao.get(balanceCutpayVO.getDccount().getBdid());

			if (balanceDccountPO.getSurplus() < balanceCutpayVO.getMoney()) {
				throw new FLException(350003, "账户金额不足");
			}

			balanceCutpayPO.setDccount(balanceDccountPO);

			if (balanceCutpayPO.getType() == balanceCutpayPO.TYPE_CUTPAY_INT){
				balanceDccountPO.setSurplus(Arith.sub(balanceDccountPO.getSurplus(), balanceCutpayPO.getMoney()));
			} else {
				balanceDccountPO.setSurplus(Arith.add(balanceDccountPO.getSurplus(), balanceCutpayPO.getMoney()));
			}

			balanceDccountDao.update(balanceDccountPO);
		}

		balanceCutpayDao.save(balanceCutpayPO);

		balancePO.setCutpay(balanceCutpayPO.getTotal());

		balanceDao.update(balancePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deductBalanceCutpay(BalanceCutpayVO balanceCutpayVO, String userId) throws FLException {

		BalancePO balancePO = balanceDao.get(balanceCutpayVO.getBalance().getBid());
		BalanceCutpayPO balanceCutpayPO = balanceCutpayDao.get(balanceCutpayVO.getBcid());

		if (balancePO == null) {
			throw new FLException(350006, "结算单不存在");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		BalanceCutpayPO balanceCutpayPO2 = new BalanceCutpayPO();
		balanceCutpayPO2.setBalance(balancePO);
		balanceCutpayPO2.setCutpay(balanceCutpayPO);
		balanceCutpayPO2.setOperater(operater);
		balanceCutpayPO2.setType(balanceCutpayVO.getType());
		balanceCutpayPO2.setName(balanceCutpayVO.getName());
		balanceCutpayPO2.setMoney(balanceCutpayVO.getMoney());
		balanceCutpayPO2.setComment(balanceCutpayVO.getComment());

		balanceCutpayPO2.setTotal(Arith.sub(balanceCutpayPO.getTotal(), balanceCutpayPO2.getMoney()));

		balanceCutpayDao.save(balanceCutpayPO2);

		balancePO.setCutpay(Arith.sub(balancePO.getCutpay(), balanceCutpayPO2.getMoney()));

		balanceDao.update(balancePO);

		return 0;
	}

}
