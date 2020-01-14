package com.fanglin.balance.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.balance.dao.ApportDetailDao;
import com.fanglin.balance.dao.BalanceDao;
import com.fanglin.balance.po.ApportDetailPO;
import com.fanglin.balance.po.BalancePO;
import com.fanglin.balance.service.ApportDetailService;
import com.fanglin.balance.vo.ApportDetailVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("apportDetailService")
@Transactional(readOnly = true)
public class ApportDetailServicerImpl implements ApportDetailService {

	@Autowired
	private ApportDetailDao apportDetailDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private BalanceDao balanceDao;

	@Override
	public List<ApportDetailVO> queryApportDetailForBalance(ApportDetailVO apportDetailVO) {
		
		List<ApportDetailPO> apportDetailPOs = apportDetailDao.queryApportDetailForBalance(apportDetailVO.getBid());
		List<ApportDetailVO> apportDetailVOs = new ArrayList<ApportDetailVO>();

		for (ApportDetailPO apportDetailPO : apportDetailPOs) {

			apportDetailVO = new ApportDetailVO(new UserBaseVO());

			BeanUtil.copyPropertie(apportDetailPO, apportDetailVO,Arrays.asList("creater"));
			BeanUtil.copyPropertie(apportDetailPO.getCreater(),apportDetailVO.getCreater(), Arrays.asList("duty", "dept"));

			apportDetailVOs.add(apportDetailVO);
		}

		return apportDetailVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addApportDetail(ApportDetailVO apportDetailVO, String userId) throws FLException {
		
		BalancePO balancePO = balanceDao.get(apportDetailVO.getBid());

		if (balancePO == null) {
			throw new FLException(350006, "结算单不存在");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		ApportDetailPO apportDetailPO = new ApportDetailPO();

		apportDetailPO.setBid(apportDetailVO.getBid());
		apportDetailPO.setCreater(creater);
		apportDetailPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		apportDetailPO.setMoney(apportDetailVO.getMoney());
		apportDetailPO.setComment(apportDetailVO.getComment());

		apportDetailDao.save(apportDetailPO);

		return 0;
	}

}
