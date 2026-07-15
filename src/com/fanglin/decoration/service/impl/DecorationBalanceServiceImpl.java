package com.fanglin.decoration.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationBalanceDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationBalancePO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationBalanceService;
import com.fanglin.decoration.vo.DecorationBalanceVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("decorationBalanceService")
@Transactional(readOnly = true)
public class DecorationBalanceServiceImpl implements DecorationBalanceService {

	@Autowired
	private DecorationBalanceDao decorationBalanceDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private UserDao userDao;

	@Override
	public void pageDecorationForBalance(Paging paging, List<Filter> filters, int company) throws FLException {

		if (filters.size() == 0) return;

		List<DecorationBalancePO> decorationBalancePOs = decorationBalanceDao.pageDecorationForBalance(paging, filters, company);
		List<DecorationBalanceVO> decorationBalanceVOs = new ArrayList<DecorationBalanceVO>();

		for (DecorationBalancePO decorationBalancePO : decorationBalancePOs) {
			DecorationBalanceVO decorationBalanceVO = new DecorationBalanceVO(new DecorationVO(), new UserBaseVO(new DutyVO()));

			BeanUtil.copyProperties(decorationBalancePO, decorationBalanceVO, Arrays.asList("decoration", "user"));

			decorationBalanceVO.getDecoration().setSupervisor(new UserBaseVO());
			decorationBalanceVO.getDecoration().setEscorter(new UserBaseVO());
			decorationBalanceVO.getDecoration().setQuoter(new UserBaseVO());

			decorationBalancePO.getDecoration().ptvcascade(decorationBalanceVO.getDecoration());

			if (decorationBalancePO.getUser() != null) {
				decorationBalanceVO.getUser().setBaseInfo(decorationBalancePO.getUser());
			}

			decorationBalanceVOs.add(decorationBalanceVO);
		}

		paging.setData(decorationBalanceVOs);
	}

	@Override
	public DecorationBalanceVO queryDecorationBalance(DecorationVO decorationVO) {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationVO.getOrderId());

		DecorationBalancePO decorationBalancePO = decorationBalanceDao.queryDecorationBalance(decorationPO.getDoid());
		DecorationBalanceVO decorationBalance = new DecorationBalanceVO(new DecorationVO(new CustomerVO(), new HouseVO(new VillageVO())), new UserBaseVO(new DutyVO()));

		BeanUtil.copyPropertie(decorationBalancePO, decorationBalance, Arrays.asList("decoration", "user"));

		if (decorationBalancePO != null) {
			BeanUtil.copyPropertie(decorationBalancePO.getUser(), decorationBalance.getUser(), Arrays.asList("duty", "dept"));
			BeanUtil.copyPropertie(decorationBalancePO.getUser().getDuty(), decorationBalance.getUser().getDuty(), Arrays.asList("departmentType"));

			decorationBalancePO.getDecoration().ptvcascade(decorationBalance.getDecoration());
		}

		return decorationBalance;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int makeDecorationBalance(DecorationBalanceVO decorationBalanceVO, String userId) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationBalanceVO.getDecoration().getOrderId());

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		DecorationBalancePO decirationBalancePO = decorationBalanceDao.queryDecorationBalance(decorationPO.getDoid());
		Timestamp balanceTime = new Timestamp(System.currentTimeMillis());

		if (decirationBalancePO != null) {

			decirationBalancePO.setBalance(decorationBalanceVO.getBalance());
			decirationBalancePO.setUser(userPO);
			decirationBalancePO.setBalanceTime(balanceTime);

			decorationPO.setBalanceStatus(DecorationPO.BALANCESTATUS_CONDUCT_INT);

			decorationBalanceDao.update(decirationBalancePO);
			decorationDao.update(decorationPO);

		} else {
			DecorationBalancePO decorationBalance = new DecorationBalancePO();

			decorationBalance.setBalance(decorationBalanceVO.getBalance());
			decorationBalance.setBalanceTime(balanceTime);
			decorationBalance.setDecoration(decorationPO);
			decorationBalance.setUser(userPO);

			decorationPO.setBalanceTime(decorationBalance.getBalanceTime());
			decorationPO.setBalanceStatus(DecorationPO.BALANCESTATUS_CONDUCT_INT);

			decorationBalanceDao.save(decorationBalance);
			decorationDao.update(decorationPO);
		}

		return 0;

	}

}
