package com.fanglin.balance.service.impl;

import java.util.ArrayList;
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
	public void pageBalanceCutpay(Paging paging, List<Filter> filters) {

		List<BalanceCutpayPO> balanceCutpayPOs = balanceCutpayDao.pageBalanceCutpay(paging, filters);
		List<BalanceCutpayVO> balanceCutpayVOs = new ArrayList<BalanceCutpayVO>();

		for (BalanceCutpayPO balanceCutpayPO : balanceCutpayPOs) {

			balanceCutpayVOs.add(balanceCutpayPO.ptv(new BalanceCutpayVO(new BalanceVO(), new UserBaseVO(), new BalanceDccountVO(), new BalanceCutpayVO())));
		}

		paging.setData(balanceCutpayVOs);
	}

	@Override
	public List<BalanceCutpayVO> queryBalanceCutpay(BalanceCutpayVO balanceCutpayVO) {

		List<BalanceCutpayPO> balanceCutpayPOs = balanceCutpayDao.queryBalanceCutpay(balanceCutpayVO.getBalance().getBid());
		List<BalanceCutpayVO> balanceCutpayVOs = new ArrayList<BalanceCutpayVO>();

		for (BalanceCutpayPO balanceCutpayPO : balanceCutpayPOs) {

			balanceCutpayVOs.add(balanceCutpayPO.ptv(new BalanceCutpayVO(new BalanceVO(), new UserBaseVO(), new BalanceDccountVO(), new BalanceCutpayVO())));
		}

		return balanceCutpayVOs;
	}

	@Override
	public List<BalanceCutpayVO> queryBalanceCutpayByOuid(BalanceCutpayVO balanceCutpayVO) {

		List<BalanceCutpayPO> balanceCutpayPOs = balanceCutpayDao.queryBalanceCutpayByOuid(balanceCutpayVO.getOperater().getUid());
		List<BalanceCutpayVO> balanceCutpayVOs = new ArrayList<BalanceCutpayVO>();

		for (BalanceCutpayPO balanceCutpayPO : balanceCutpayPOs) {

			balanceCutpayVOs.add(balanceCutpayPO.ptv(new BalanceCutpayVO(new BalanceVO(), new UserBaseVO(), new BalanceDccountVO(), new BalanceCutpayVO())));
		}

		return balanceCutpayVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addBalanceCutpay(BalanceCutpayVO balanceCutpayVO, String userId) throws FLException {

		UserPO operater = userDao.queryUserByUserId(userId);

		BalanceCutpayPO balanceCutpayPO = new BalanceCutpayPO();

		balanceCutpayPO.setName(balanceCutpayVO.getName());
		balanceCutpayPO.setOperater(operater);
		balanceCutpayPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		balanceCutpayPO.setMoney(balanceCutpayVO.getMoney());
		balanceCutpayPO.setType(balanceCutpayVO.getType());
		balanceCutpayPO.setComment(balanceCutpayVO.getComment());

		if (balanceCutpayVO.getDccount() != null) {

			BalanceDccountPO balanceDccountPO = balanceDccountDao.get(balanceCutpayVO.getDccount().getBdid());

			if (balanceDccountPO.getSurplus() < balanceCutpayVO.getMoney()) {
				throw new FLException(350003, "账户金额不足");
			}

			balanceCutpayPO.setDccount(balanceDccountPO);

			if (balanceCutpayPO.getType() == balanceCutpayPO.TYPE_CUTPAY_INT) {
				balanceDccountPO.setSurplus(Arith.sub(balanceDccountPO.getSurplus(), balanceCutpayPO.getMoney()));
			} else {
				balanceDccountPO.setSurplus(Arith.add(balanceDccountPO.getSurplus(), balanceCutpayPO.getMoney()));
			}

			balanceDccountDao.update(balanceDccountPO);
		}

		balanceCutpayDao.save(balanceCutpayPO);

		if (balanceCutpayVO.getBalance() == null) return 0;

		BalancePO balancePO = balanceDao.get(balanceCutpayVO.getBalance().getBid());

		if (balancePO == null) {
			throw new FLException(350006, "结算单不存在");
		}

		if (balancePO.getSurplus() < balanceCutpayVO.getMoney()) {
			throw new FLException(350003, "结算单金额不足");
		}

		balanceCutpayPO.setBalance(balancePO);

		if (balanceCutpayPO.getType() == balanceCutpayPO.TYPE_CUTPAY_INT) {
			balanceCutpayPO.setTotal(Arith.add(balancePO.getCutpay(), balanceCutpayPO.getMoney()));
		} else {
			balanceCutpayPO.setTotal(Arith.sub(balancePO.getCutpay(), balanceCutpayPO.getMoney()));
		}

		balancePO.setCutpay(balanceCutpayPO.getTotal());

		balanceDao.update(balancePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitBalanceCutpay(BalanceCutpayVO balanceCutpayVO, String userId) throws FLException {

		BalanceCutpayPO balanceCutpayPO = balanceCutpayDao.get(balanceCutpayVO.getBcid());

		if (balanceCutpayPO == null) {
			throw new FLException(350023, "结算扣款不存在");
		}

		if (balanceCutpayVO.getBalance() == null) {
			throw new FLException(350006, "结算单不存在");
		}

		BalancePO balancePO = balanceDao.get(balanceCutpayVO.getBalance().getBid());

		if (balancePO == null) {
			throw new FLException(350006, "结算单不存在");
		}

		if (balancePO.getSurplus() < balanceCutpayPO.getMoney()) {
			throw new FLException(350003, "结算单金额不足");
		}

		balanceCutpayPO.setBalance(balancePO);
		balanceCutpayPO.setStatus(BalanceCutpayPO.STATUS_BIND_INT);
		balanceCutpayPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		balanceCutpayPO.setTotal(Arith.add(balancePO.getCutpay(), balanceCutpayPO.getMoney()));
		balanceCutpayPO.setComment(balanceCutpayVO.getComment());

		balanceCutpayDao.update(balanceCutpayPO);

		balancePO.setSurplus(Arith.sub(balancePO.getSurplus(), balanceCutpayPO.getMoney()));
		balancePO.setCutpay(Arith.add(balancePO.getCutpay(), balanceCutpayPO.getMoney()));

		balanceDao.update(balancePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int unbindBalanceCutpay(BalanceCutpayVO balanceCutpayVO, String userId) throws FLException {

		BalanceCutpayPO balanceCutpayPO = balanceCutpayDao.get(balanceCutpayVO.getBcid());

		if (balanceCutpayPO == null) {
			throw new FLException(350023, "结算扣款不存在");
		}

		if (balanceCutpayVO.getBalance() == null) {
			throw new FLException(350006, "结算单不存在");
		}

		BalancePO balancePO = balanceDao.get(balanceCutpayVO.getBalance().getBid());

		if (balancePO == null) {
			throw new FLException(350006, "结算单不存在");
		}

		balanceCutpayPO.setBalance(null);
		balanceCutpayPO.setStatus(BalanceCutpayPO.STATUS_INIT_INT);
		balanceCutpayPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		balanceCutpayPO.setTotal(0);

		balanceCutpayDao.update(balanceCutpayPO);

		balancePO.setSurplus(Arith.add(balancePO.getSurplus(), balanceCutpayPO.getMoney()));
		balancePO.setCutpay(Arith.sub(balancePO.getCutpay(), balanceCutpayPO.getMoney()));

		balanceDao.update(balancePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deductBalanceCutpay(BalanceCutpayVO balanceCutpayVO, String userId) throws FLException {

		BalancePO balancePO = balanceDao.get(balanceCutpayVO.getBalance().getBid());

		if (balancePO == null) {
			throw new FLException(350006, "结算单不存在");
		}

		BalanceCutpayPO balanceCutpayPO = balanceCutpayDao.get(balanceCutpayVO.getBcid());

		if (balanceCutpayPO == null) {
			throw new FLException(350023, "结算扣款不存在");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		BalanceCutpayPO balanceCutpayDO = new BalanceCutpayPO();

		balanceCutpayDO.setBalance(balancePO);
		balanceCutpayDO.setCutpay(balanceCutpayPO);
		balanceCutpayDO.setOperater(operater);
		balanceCutpayDO.setType(balanceCutpayVO.getType());
		balanceCutpayDO.setName(balanceCutpayVO.getName());
		balanceCutpayDO.setMoney(balanceCutpayVO.getMoney());
		balanceCutpayDO.setComment(balanceCutpayVO.getComment());

		balanceCutpayDO.setTotal(Arith.sub(balanceCutpayPO.getTotal(), balanceCutpayDO.getMoney()));

		balanceCutpayDao.save(balanceCutpayDO);

		balancePO.setCutpay(Arith.sub(balancePO.getCutpay(), balanceCutpayDO.getMoney()));

		balanceDao.update(balancePO);

		return 0;
	}

}
