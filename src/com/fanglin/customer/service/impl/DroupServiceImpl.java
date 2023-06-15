package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.DroupDao;
import com.fanglin.customer.po.DroupPO;
import com.fanglin.customer.service.DroupService;
import com.fanglin.customer.vo.DroupVO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.dingding.bean.Group;
import com.fanglin.dingding.service.GroupService;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("droupService")
@Transactional(readOnly = true)
public class DroupServiceImpl implements DroupService {

	@Autowired
	private DroupDao droupDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private GroupService groupService;

	@Override
	public void pageDroup(Paging paging, List<Filter> filters) {

		List<DroupPO> droupPOs = droupDao.pageDroup(paging, filters);
		List<DroupVO> droupVOs = new ArrayList<DroupVO>();

		for (DroupPO droupPO : droupPOs) {

			DroupVO droupVO = new DroupVO();

			if (droupPO.getDecoration() != null) {

				droupVO.setDecoration(new DecorationVO());

				droupPO.getDecoration().ptvcascade(droupVO.getDecoration());
			}

			BeanUtil.copyProperties(droupPO, droupVO, Arrays.asList("decoration"));

			droupVOs.add(droupVO);
		}

		paging.setData(droupVOs);
	}

	@Override
	public DroupVO queryDroup(DroupVO droupVO) throws FLException {

		String orderId = droupVO.getDecoration() != null ? droupVO.getDecoration().getOrderId() : null;

		String chatId = droupVO.getChatId();
		String openId = droupVO.getOpenId();

		DroupPO droupPO = droupDao.queryDroup(orderId, chatId, openId);

		if (droupPO == null) {

			throw new FLException(330067, "群信息不存在");
		}

		BeanUtil.copyProperties(droupPO, droupVO, Arrays.asList("decoration"));

		if (droupPO.getDecoration() != null) {
			droupVO.setDecoration(new DecorationVO());
			droupPO.getDecoration().ptvcascade(droupVO.getDecoration());
		}

		return droupVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int bindDroup(DroupVO droupVO, String userId) throws FLException {

		String orderId = droupVO.getDecoration().getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		DroupPO droupPO = null;

		if (orderId == null) {
			droupPO = droupDao.queryDroup(orderId, null, null);
		}

		if (droupPO != null) {
			throw new FLException(330068, "群信息已存在");
		}

		droupPO = droupDao.queryDroup(null, droupVO.getChatId(), null);

		if (droupPO != null) {
			throw new FLException(330068, "群信息已存在");
		}

		String houseNumber = decorationPO.getHouse().getHouseNumber();

		String name = decorationPO.getHouse().getVillage().getName();

		droupPO = new DroupPO();

		if (droupVO.getType() == 1) {

			Group group = new Group().init();

			group.setName(orderId + name + houseNumber);
			group.setOwner(userId);

			group.getUsers().add(userId);

			groupService.create(group, decorationPO.getCompany());
			groupService.template(group, decorationPO.getCompany());

			droupPO.setName(droupVO.getName());
			droupPO.setChatId(group.getChatId());
			droupPO.setOpenId(group.getOpenId());

		} else if (droupVO.getType() == 2) {
			droupPO.setName(droupVO.getName());
			droupPO.setChatId(droupVO.getChatId());
			droupPO.setOpenId(droupVO.getOpenId());
		}

		droupPO.setDecoration(decorationPO);
		droupPO.setType(droupVO.getType());

		droupDao.save(droupPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateDroup(DroupVO droupVO) throws FLException {

		DroupPO droupPO = droupDao.get(droupVO.getDid());

		if (droupVO.getIsRead() != null) {

			droupPO.setIsRead(droupVO.getIsRead());
		}

		if (droupVO.getUserId() != null) {

			Group group = new Group().init();
			group.getUsers().add(droupVO.getUserId());
			group.setChatId(droupPO.getChatId());
			group.setOpenId(droupPO.getOpenId());
			groupService.update(group, droupPO.getCompany());

		}

		droupDao.update(droupPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteDroup(DroupVO droup) {

		DroupPO droupPO = droupDao.get(droup.getDid());

		droupDao.delete(droupPO);

		return 0;
	}

}
