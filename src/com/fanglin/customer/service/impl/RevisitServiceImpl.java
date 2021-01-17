package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.RevisitDao;
import com.fanglin.customer.po.RevisitPO;
import com.fanglin.customer.service.RevisitService;
import com.fanglin.customer.vo.RevisitVO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("revisitService")
@Transactional(readOnly = true)
public class RevisitServiceImpl implements RevisitService {

	@Autowired
	private RevisitDao revisitDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private UserDao userDao;

	@Override
	public void pageRevisit(Paging paging, List<Filter> filters) {

		List<RevisitPO> revisitPOs = revisitDao.pageRevisit(paging, filters);
		List<RevisitVO> revisitVOs = new ArrayList<RevisitVO>();

		for (RevisitPO revisitPO : revisitPOs) {

			RevisitVO revisitVO = new RevisitVO(new DecorationVO(new CustomerVO(), new HouseVO()), new UserBaseVO());

			BeanUtil.copyProperties(revisitPO, revisitVO, Arrays.asList("decoration", "creater"));
			BeanUtil.copyProperties(revisitPO.getCreater(), revisitVO.getCreater(), Arrays.asList("dept", "duty", "role"));
			BeanUtil.copyProperties(ptv(revisitPO.getDecoration()), revisitVO.getDecoration());

			revisitVOs.add(revisitVO);
		}

		paging.setData(revisitVOs);
	}

	@Override
	public List<RevisitVO> queryRevisitByOrderId(RevisitVO revisitVO) {

		List<RevisitPO> revisitPOs = revisitDao.queryRevisitByOrderId(revisitVO.getDecoration().getOrderId());
		List<RevisitVO> revisitVOs = new ArrayList<RevisitVO>();

		for (RevisitPO revisitPO : revisitPOs) {

			revisitVO = new RevisitVO(new DecorationVO(new CustomerVO(), new HouseVO()), new UserBaseVO());

			BeanUtil.copyProperties(revisitPO, revisitVO, Arrays.asList("decoration", "creater"));
			BeanUtil.copyProperties(revisitPO.getCreater(), revisitVO.getCreater(), Arrays.asList("dept", "duty", "role"));
			BeanUtil.copyProperties(ptv(revisitPO.getDecoration()), revisitVO.getDecoration());

			revisitVOs.add(revisitVO);
		}

		return revisitVOs;

	}

	@Override
	public List<RevisitVO> queryRevisitForAepair(RevisitVO revisitVO) {

		List<RevisitVO> revisitVOs = new ArrayList<RevisitVO>();
		List<RevisitPO> revisitPOs = revisitDao.queryRevisitForAepair(revisitVO.getIdent());

		for (RevisitPO revisitPO : revisitPOs) {

			revisitVO = new RevisitVO(new DecorationVO(new CustomerVO(), new HouseVO()), new UserBaseVO());

			BeanUtil.copyProperties(revisitPO, revisitVO, Arrays.asList("decoration", "creater"));
			BeanUtil.copyProperties(revisitPO.getCreater(), revisitVO.getCreater(), Arrays.asList("dept", "duty", "role"));
			BeanUtil.copyProperties(ptv(revisitPO.getDecoration()), revisitVO.getDecoration());

			revisitVOs.add(revisitVO);
		}

		return revisitVOs;
	}

	@Override
	public List<RevisitVO> queryRevisitForComplain(RevisitVO revisitVO) {

		List<RevisitVO> revisitVOs = new ArrayList<RevisitVO>();
		List<RevisitPO> revisitPOs = revisitDao.queryRevisitForComplain(revisitVO.getIdent());

		for (RevisitPO revisitPO : revisitPOs) {

			revisitVO = new RevisitVO(new DecorationVO(new CustomerVO(), new HouseVO()), new UserBaseVO());

			BeanUtil.copyProperties(revisitPO, revisitVO, Arrays.asList("decoration", "creater"));
			BeanUtil.copyProperties(revisitPO.getCreater(), revisitVO.getCreater(), Arrays.asList("dept", "duty", "role"));
			BeanUtil.copyProperties(ptv(revisitPO.getDecoration()), revisitVO.getDecoration());

			revisitVOs.add(revisitVO);
		}

		return revisitVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void visitRevisit(RevisitVO revisitVO, String userId) {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(revisitVO.getDecoration().getOrderId());

		UserPO create = userDao.queryUserByUserId(userId);

		RevisitPO revisitPO = new RevisitPO();

		BeanUtil.copyPropertie(revisitVO, revisitPO, Arrays.asList("decoration", "creater"));

		revisitPO.setDecoration(decorationPO);
		revisitPO.setCreater(create);
		revisitPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		revisitDao.save(revisitPO);
	}

	private DecorationVO ptv(DecorationPO decorationPO) {

		DecorationVO decorationVO = new DecorationVO();

		decorationVO.setSupervisor(new UserBaseVO());

		decorationPO.ptvcascade(decorationVO);

		return decorationVO;
	}

}
