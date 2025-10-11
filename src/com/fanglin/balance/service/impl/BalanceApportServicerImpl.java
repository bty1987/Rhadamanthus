package com.fanglin.balance.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.balance.dao.BalanceApportDao;
import com.fanglin.balance.dao.BalanceDao;
import com.fanglin.balance.po.BalanceApportPO;
import com.fanglin.balance.po.BalancePO;
import com.fanglin.balance.service.BalanceApportService;
import com.fanglin.balance.vo.BalanceApportVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("balanceApportService")
@Transactional(readOnly = true)
public class BalanceApportServicerImpl implements BalanceApportService {

	@Autowired
	private BalanceApportDao balanceApportDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private BalanceDao balanceDao;

	@Override
	public List<BalanceApportVO> queryBalanceApportForBalance(BalanceApportVO balanceApportVO) {

		List<BalanceApportPO> balanceApportPOs = balanceApportDao.queryBalanceApportForBalance(balanceApportVO.getBid());
		List<BalanceApportVO> balanceApportVOs = new ArrayList<BalanceApportVO>();

		for (BalanceApportPO balanceApportPO : balanceApportPOs) {

			balanceApportVO = new BalanceApportVO(new UserBaseVO());

			BeanUtil.copyPropertie(balanceApportPO, balanceApportVO, Arrays.asList("creater"));
			BeanUtil.copyPropertie(balanceApportPO.getCreater(), balanceApportVO.getCreater(), Arrays.asList("duty", "dept"));

			balanceApportVOs.add(balanceApportVO);
		}

		return balanceApportVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addBalanceApport(BalanceApportVO balanceApportVO, String userId) throws FLException {

		BalancePO balancePO = balanceDao.get(balanceApportVO.getBid());

		if (balancePO == null) {
			throw new FLException(350006, "结算单不存在");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		BalanceApportPO balanceApportPO = new BalanceApportPO();

		balanceApportPO.setBid(balanceApportVO.getBid());
		balanceApportPO.setCreater(creater);
		balanceApportPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		balanceApportPO.setMoney(balanceApportVO.getMoney());
		balanceApportPO.setComment(balanceApportVO.getComment());

		balanceApportDao.save(balanceApportPO);

		return 0;
	}

}
