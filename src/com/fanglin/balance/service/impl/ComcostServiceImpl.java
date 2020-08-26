package com.fanglin.balance.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.balance.dao.ComcostDao;
import com.fanglin.balance.po.ComcostPO;
import com.fanglin.balance.service.ComcostService;
import com.fanglin.balance.vo.ComcostVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("comcostService")
@Transactional(readOnly = true)
public class ComcostServiceImpl implements ComcostService {

	@Autowired
	private ComcostDao comcostDao;

	@Autowired
	private UserDao userDao;

	@Override
	public void pageComcost(Paging paging, List<Filter> filters, String userId) {

		List<ComcostPO> comcostPOs = comcostDao.pageComcost(paging, filters);

		List<ComcostVO> comcostVOs = new ArrayList<ComcostVO>();

		for (ComcostPO comcostPO : comcostPOs) {

			ComcostVO comcostVO = new ComcostVO(new UserBaseVO());

			BeanUtil.copyProperties(comcostPO, comcostVO, Arrays.asList("creater"));
			BeanUtil.copyProperties(comcostPO.getCreater(), comcostVO.getCreater(), Arrays.asList("dept", "duty", "role"));

			comcostVOs.add(comcostVO);
		}

		paging.setData(comcostVOs);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addComcost(ComcostVO comcostVO, String userId, int company) throws FLException {

		ComcostPO comcostPO = new ComcostPO();

		UserPO create = userDao.queryUserByUserId(userId);

		comcostPO.setCompany(company);
		comcostPO.setCreater(create);
		comcostPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		comcostPO.setComment(comcostVO.getComment());
		comcostPO.setIdent(comcostVO.getIdent());
		comcostPO.setType(comcostVO.getType());
		comcostPO.setStatus(ComcostPO.STATUS_VALID_SHORT);
		comcostPO.setMoney(comcostVO.getMoney());
		comcostPO.setOrderId(comcostVO.getOrderId());

		comcostDao.save(comcostPO);
	}

	@Override
	public List<ComcostVO> queryComcost(ComcostVO comcostVO) {

		List<ComcostPO> comcostPOs = comcostDao.queryComcost(comcostVO.getIdent(), comcostVO.getType());
		List<ComcostVO> comcostVOs = new ArrayList<ComcostVO>();

		for (ComcostPO comcostPO : comcostPOs) {

			comcostVO = new ComcostVO(new UserBaseVO());

			BeanUtil.copyProperties(comcostPO, comcostVO, Arrays.asList("creater"));
			BeanUtil.copyProperties(comcostPO.getCreater(), comcostVO.getCreater(), Arrays.asList("dept", "duty", "role"));

			comcostVOs.add(comcostVO);
		}

		return comcostVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateComcostForStatus(ComcostVO comcostVO) throws FLException {

		ComcostPO comcostPO = comcostDao.get(comcostVO.getCid());

		if (comcostPO == null) {
			throw new FLException(350011, "成本不存在");
		}

		comcostPO.setStatus(comcostVO.getStatus());

		comcostDao.update(comcostPO);
	}
}
