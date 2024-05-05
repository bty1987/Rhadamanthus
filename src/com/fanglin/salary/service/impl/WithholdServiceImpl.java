package com.fanglin.salary.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.salary.dao.WithholdDao;
import com.fanglin.salary.po.WithholdPO;
import com.fanglin.salary.service.WithholdService;
import com.fanglin.salary.vo.WithholdVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("WithholdService")
@Transactional(readOnly = true)
public class WithholdServiceImpl implements WithholdService {

	@Autowired
	private WithholdDao withholdDao;

	@Autowired
	private UserDao userDao;

	@Override
	public void pageWithhold(Paging paging, List<Filter> filters, WithholdVO withholdVO) {

		if (withholdVO == null) {
			withholdVO = new WithholdVO();
		}

		if (withholdVO.getUser() != null) {
			filters.add(new Filter("userId", withholdVO.getUser().getUserId(), "eq"));
		}

		if (withholdVO.getCreateTime() != null) {

			String start = DateUtil.getDateToDateString(DateUtil.getFirstDay(DateUtil.getTimestampToDate(withholdVO.getCreateTime())), "yyyy/MM/dd");
			String end = DateUtil.getDateToDateString(DateUtil.getLastDay(DateUtil.getTimestampToDate(withholdVO.getCreateTime())), "yyyy/MM/dd");

			filters.add(new Filter("createTime", String.format("%s-%s", start, end), "eq"));
		}

		List<WithholdPO> withholdPOs = withholdDao.pageWithhold(paging, filters);
		List<WithholdVO> withholdVOs = new ArrayList<WithholdVO>();

		for (WithholdPO withholdPO : withholdPOs) {

			withholdVO = new WithholdVO(new UserBaseVO(), new UserBaseVO());

			BeanUtil.copyPropertie(withholdPO, withholdVO, Arrays.asList("user", "operater"));
			BeanUtil.copyPropertie(withholdPO.getUser(), withholdVO.getUser(), Arrays.asList("role", "dept", "duty"));
			BeanUtil.copyPropertie(withholdPO.getOperater(), withholdVO.getOperater(), Arrays.asList("role", "dept", "duty"));

			withholdVOs.add(withholdVO);
		}

		if (withholdVOs.size() == 0) {
			withholdVOs.add(new WithholdVO(new UserBaseVO(), new UserBaseVO()).init(new WithholdPO(), "保险"));
			withholdVOs.add(new WithholdVO(new UserBaseVO(), new UserBaseVO()).init(new WithholdPO(), "迟到"));
			withholdVOs.add(new WithholdVO(new UserBaseVO(), new UserBaseVO()).init(new WithholdPO(), "早退"));
		}

		paging.setData(withholdVOs);
	}

	@Override
	public List<WithholdVO> queryWithhold(WithholdVO withhold) {

		List<WithholdPO> withholdPOs = withholdDao.queryWithhold(withhold.getIdent(), withhold.getType());
		List<WithholdVO> withholdVOs = new ArrayList<WithholdVO>();

		for (WithholdPO withholdPO : withholdPOs) {

			WithholdVO withholdVO = new WithholdVO(new UserBaseVO(), new UserBaseVO());
			BeanUtil.copyPropertie(withholdPO, withholdVO, Arrays.asList("user", "operater"));
			BeanUtil.copyPropertie(withholdPO.getUser(), withholdVO.getUser(), Arrays.asList("role", "dept", "duty"));
			BeanUtil.copyPropertie(withholdPO.getOperater(), withholdVO.getOperater(), Arrays.asList("role", "dept", "duty"));

			withholdVOs.add(withholdVO);

		}

		return withholdVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addWithhold(WithholdVO withhold, String userId) throws FLException {

		WithholdPO withholdPO = new WithholdPO(new UserPO(), new UserPO());

		UserPO user = userDao.get(withhold.getUser().getUid());
		UserPO operater = userDao.queryUserByUserId(userId);

		withholdPO.setIdent(withhold.getIdent());
		withholdPO.setType(withhold.getType());
		withholdPO.setOrderId(withhold.getOrderId());
		withholdPO.setUser(user);
		withholdPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		withholdPO.setMoney(withhold.getMoney());
		withholdPO.setOperater(operater);
		withholdPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		withholdPO.setComment(withhold.getComment());

		withholdDao.save(withholdPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateWithholdForStatus(WithholdVO withhold, String userId) throws FLException {

		WithholdPO withholdPO = withholdDao.get(withhold.getWid());

		if (withholdPO == null) {

			throw new FLException(280013, "扣款信息不存在");
		}
		UserPO operater = userDao.queryUserByUserId(userId);

		withholdPO.setStatus(withhold.getStatus());
		withholdPO.setOperater(operater);
		withholdPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));

		withholdDao.update(withholdPO);

		return 0;
	}

}
