package com.fanglin.balance.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.balance.dao.BalanceDccountDao;
import com.fanglin.balance.po.BalanceDccountPO;
import com.fanglin.balance.service.BalanceDccountService;
import com.fanglin.balance.vo.BalanceDccountVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("balanceDccountService")
@Transactional(readOnly = true)
public class BalanceDccountServiceImpl implements BalanceDccountService {

	@Autowired
	private BalanceDccountDao balanceDccountDao;

	@Autowired
	private UserDao userDao;

	@Override
	public void pageBalanceDccount(Paging paging, List<Filter> filters, String userId) {

		List<BalanceDccountPO> balanceDccountPOs = balanceDccountDao.pageBalanceDccount(paging, filters);
		List<BalanceDccountVO> balanceDccountVOs = new ArrayList<BalanceDccountVO>();

		for (BalanceDccountPO balanceDccountsPO : balanceDccountPOs) {

			BalanceDccountVO balanceDccountVO = new BalanceDccountVO(new UserBaseVO(), new UserBaseVO());

			BeanUtil.copyProperties(balanceDccountsPO, balanceDccountVO, Arrays.asList("creater", "belonger"));
			BeanUtil.copyProperties(balanceDccountsPO.getCreater(), balanceDccountVO.getCreater(), Arrays.asList("dept", "duty", "role"));
			BeanUtil.copyProperties(balanceDccountsPO.getBelonger(), balanceDccountVO.getBelonger(), Arrays.asList("dept", "duty", "role"));

			balanceDccountVOs.add(balanceDccountVO);
		}

		paging.setData(balanceDccountVOs);
	}

	@Override
	public List<BalanceDccountVO> queryBalanceDccount(BalanceDccountVO balanceDccountVO) {

		List<BalanceDccountPO> balanceDccountPOs = balanceDccountDao.queryBalanceDccount(balanceDccountVO.getBelonger().getUid());
		List<BalanceDccountVO> balanceDccountVOs = new ArrayList<BalanceDccountVO>();

		for (BalanceDccountPO balanceDccountPO : balanceDccountPOs) {

			balanceDccountVO = new BalanceDccountVO(new UserBaseVO(), new UserBaseVO());

			BeanUtil.copyProperties(balanceDccountPO, balanceDccountVO, Arrays.asList("creater", "belonger"));
			BeanUtil.copyProperties(balanceDccountPO.getCreater(), balanceDccountVO.getCreater(), Arrays.asList("dept", "duty", "role"));
			BeanUtil.copyProperties(balanceDccountPO.getBelonger(), balanceDccountVO.getBelonger(), Arrays.asList("dept", "duty", "role"));

			balanceDccountVOs.add(balanceDccountVO);
		}
		return balanceDccountVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addBalanceDccount(BalanceDccountVO balanceDccountVO, String userId) {

		UserPO create = userDao.queryUserByUserId(userId);
		UserPO belonger = userDao.queryUserByUserId(balanceDccountVO.getBelonger().getUserId());

		BalanceDccountPO balanceDccountPO = new BalanceDccountPO();

		balanceDccountPO.setCutpay(balanceDccountVO.getCutpay());
		balanceDccountPO.setSurplus(balanceDccountVO.getCutpay());
		balanceDccountPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		balanceDccountPO.setStartTime(balanceDccountVO.getStartTime());
		balanceDccountPO.setEndTime(balanceDccountVO.getEndTime());
		balanceDccountPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		balanceDccountPO.setName(balanceDccountVO.getName());
		balanceDccountPO.setCreater(create);
		balanceDccountPO.setBelonger(belonger);
		balanceDccountPO.setType(balanceDccountVO.getType());
		balanceDccountPO.setComment(balanceDccountVO.getComment());

		balanceDccountDao.save(balanceDccountPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateBalanceDccountForStatus(BalanceDccountVO balanceDccountVO) throws FLException {

		BalanceDccountPO balanceDccountPO = balanceDccountDao.get(balanceDccountVO.getBdid());

		if (balanceDccountPO == null) {
			throw new FLException(350032, "扣款不存在");
		}

		balanceDccountPO.setStatus(balanceDccountVO.getStatus());

		balanceDccountDao.update(balanceDccountPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateBalanceDccount(BalanceDccountVO balanceDccountVO) throws FLException {

		BalanceDccountPO balanceDccountPO = balanceDccountDao.get(balanceDccountVO.getBdid());

		if (balanceDccountPO == null) {
			throw new FLException(350032, "扣款不存在");
		}

		balanceDccountPO.setName(balanceDccountVO.getName());

		balanceDccountDao.update(balanceDccountPO);

		return 0;
	}


}
