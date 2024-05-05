package com.fanglin.personel.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.personel.dao.UserFunctionDao;
import com.fanglin.personel.po.UserFunctionPO;
import com.fanglin.personel.service.UserFunctionService;
import com.fanglin.personel.vo.UserFunctionVO;
import com.fanglin.utils.BeanUtil;

@Service("userFunctionService")
@Transactional(readOnly = true)
public class UserFunctionServiceImpl implements UserFunctionService {

	@Autowired
	private UserFunctionDao userFunctionDao;

	@Override
	public List<UserFunctionVO> queryUserFunction(UserFunctionVO userFunctionVO) {

		List<UserFunctionPO> userFunctionPOs = userFunctionDao.queryUserFunction(userFunctionVO.getType());
		List<UserFunctionVO> userFunctionVOs = new ArrayList<UserFunctionVO>();

		for (UserFunctionPO userFunctionPO : userFunctionPOs) {

			userFunctionVO = new UserFunctionVO();
			BeanUtil.copyPropertie(userFunctionPO, userFunctionVO);

			userFunctionVOs.add(userFunctionVO);

		}

		return userFunctionVOs;
	}

}
