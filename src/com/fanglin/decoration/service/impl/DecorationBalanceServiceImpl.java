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
	public void pageDecorationForBalance(Paging paging, List<Filter> filters) throws FLException {

		if (filters.size() == 0) return;

		List<DecorationBalancePO> decorationBalancePOs = decorationBalanceDao.pageDecorationForBalance(paging, filters);
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

		for (DecorationBalancePO decorationBalancePO : decorationBalancePOs) {
			DecorationVO decorationVO = new DecorationVO();

			decorationVO.setSupervisor(new UserBaseVO());
			decorationVO.setEscorter(new UserBaseVO());
			decorationVO.setQuoter(new UserBaseVO());

			decorationBalancePO.getDecoration().ptvcascade(decorationVO);

			decorationVOs.add(decorationVO);
		}

		paging.setData(decorationVOs);
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
			throw new FLException(140013, "订单不存在");
		}

		DecorationBalancePO decirationBalancePO = decorationBalanceDao.queryDecorationBalance(decorationPO.getDoid());

		if (decirationBalancePO != null) {

			decirationBalancePO.setBalance(decorationBalanceVO.getBalance());
			decirationBalancePO.setUser(userPO);

			decorationPO.setBalanceStatus(DecorationPO.BALANCESTATUS_CONDUCT_INT);

			decorationBalanceDao.update(decirationBalancePO);
			decorationDao.update(decorationPO);

		} else {
			DecorationBalancePO decorationBalance = new DecorationBalancePO();

			decorationBalance.setBalance(decorationBalanceVO.getBalance());
			decorationBalance.setBalanceTime(new Timestamp(System.currentTimeMillis()));
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
