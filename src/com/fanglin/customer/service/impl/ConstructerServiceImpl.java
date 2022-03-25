package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.po.ConstructerPO;
import com.fanglin.customer.dao.ConstructerDao;
import com.fanglin.customer.service.ConstructerService;
import com.fanglin.customer.vo.ConstructerVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;

@Service("constructerOrderService")
@Transactional(readOnly = true)
public class ConstructerServiceImpl implements ConstructerService {

	@Autowired
	private ConstructerDao constructerDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<ConstructerVO> queryCusConstructer(String orderId) {

		List<ConstructerPO> constructerPOs = constructerDao.queryCusConstructer(orderId);
		List<ConstructerVO> constructerVOs = new ArrayList<ConstructerVO>();

		if (constructerPOs.size() != 0 && constructerPOs != null) {

			for (ConstructerPO constructerPO : constructerPOs) {

				UserPO userPO = userDao.queryUserByUserId(constructerPO.getUser().getUserId());

				ConstructerVO constructerVO = new ConstructerVO();

				constructerVO.setCurrentName(userPO.getCurrentName());
				constructerVO.setPhone(userPO.getPhone());
				constructerVO.setSchedule(constructerPO.getSchedule());
				constructerVO.setUserId(userPO.getUserId());
				constructerVO.setUserName(userPO.getUserName());
				constructerVO.setUserPhotop(userPO.getUserPhoto());

				constructerVOs.add(constructerVO);
			}
		}

		return constructerVOs;
	}

}
