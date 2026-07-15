package com.fanglin.construction.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.DutyVO;
import com.fanglin.construction.dao.QualiterDao;
import com.fanglin.construction.po.ConstructerPO;
import com.fanglin.construction.po.QualiterPO;
import com.fanglin.construction.service.QualiterService;
import com.fanglin.construction.vo.QualiterVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("qualiterService")
@Transactional(readOnly = true)
public class QualiterServiceImpl implements QualiterService {

	@Autowired
	private QualiterDao qualiterDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DecorationDao decorationDao;

	@Override
	public void pageConstructionForQualiter(Paging paging, List<Filter> filters, String userId) throws FLException {

		if (userId == null) return;

		filters.add(new Filter("userId", userId, "eq"));

		List<QualiterPO> qualiterPOs = qualiterDao.pageConstructionForQualiter(paging, filters);
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

		for (QualiterPO qualiterPO : qualiterPOs) {

			DecorationVO decorationVO = new DecorationVO();

			decorationVO.setSupervisor(new UserBaseVO());

			qualiterPO.getDecoration().ptvcascade(decorationVO);

			decorationVOs.add(decorationVO);
		}

		paging.setData(decorationVOs);
	}

	@Override
	public List<QualiterVO> queryQualiter(QualiterVO qualiterVO) {

		String orderId = qualiterVO.getDecoration().getOrderId();

		List<QualiterPO> qualiterPOs = qualiterDao.queryQualiter(orderId);
		List<QualiterVO> qualiterVOs = new ArrayList<QualiterVO>();

		for (QualiterPO qualiterPO : qualiterPOs) {

			QualiterVO qualiter = new QualiterVO(new DecorationVO(), new UserVO(new DutyVO()), new UserVO(new DutyVO()));

			BeanUtil.copyProperties(qualiterPO, qualiter, Arrays.asList("decoration", "user", "creater"));

			qualiterPO.getDecoration().ptvcascade(qualiterVO.getDecoration());

			BeanUtil.copyProperties(qualiterPO.getUser(), qualiter.getUser(), Arrays.asList("role", "dept", "duty"));
			BeanUtil.copyProperties(qualiterPO.getUser().getDuty(), qualiter.getUser().getDuty(), Arrays.asList("departmentType"));
			BeanUtil.copyProperties(qualiterPO.getCreater(), qualiter.getCreater(), Arrays.asList("role", "dept", "duty"));

			qualiterVOs.add(qualiter);
		}

		return qualiterVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addQualiter(QualiterVO qualiterVO, String createrId) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(qualiterVO.getDecoration().getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		UserPO userPO = userDao.queryUserByUserId(qualiterVO.getUser().getUserId());

		if (userPO == null) {
			throw new FLException(220005, "员工不存在");
		}

		UserPO creater = userDao.queryUserByUserId(createrId);

		QualiterPO qualiterPO = new QualiterPO(userPO, creater);

		BeanUtil.copyProperties(qualiterVO, qualiterPO, Arrays.asList("user", "creater", "decoration"));

		qualiterPO.setDecoration(decorationPO);
		qualiterPO.setUser(userPO);
		qualiterPO.setCreater(creater);
		qualiterPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		qualiterPO.setStatus(ConstructerPO.STATUS_INIT_INT);

		qualiterDao.save(qualiterPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteQualiter(QualiterVO qualiterVO) throws FLException {

		QualiterPO qualiterPO = qualiterDao.get(qualiterVO.getQid());

		qualiterDao.delete(qualiterPO);
	}

}
