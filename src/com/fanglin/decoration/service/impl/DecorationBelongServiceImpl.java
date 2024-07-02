/**
 * @File Name		: DecorationBelongServiceImpl
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.decoration.dao.DecorationBelongDao;
import com.fanglin.decoration.po.DecorationBelongPO;
import com.fanglin.decoration.service.DecorationBelongService;
import com.fanglin.decoration.vo.DecorationBelongVO;
import com.fanglin.personel.vo.UserBaseVO;

@Service("orderBelongInfoService")
@Transactional(readOnly = true)
public class DecorationBelongServiceImpl implements DecorationBelongService {

	@Autowired
	private DecorationBelongDao decorationBelongDao;

	@Override
	public List<DecorationBelongVO> queryDecorationBelong(DecorationBelongVO decorationBelongVO) {

		List<DecorationBelongVO> decorationBelongVOs = new ArrayList<DecorationBelongVO>();
		List<DecorationBelongPO> decorationBelongPOs = decorationBelongDao.queryDecorationBelong(decorationBelongVO.getOrderId(), decorationBelongVO.getType(), decorationBelongVO.getStatus());

		for (DecorationBelongPO decorationBelongPO : decorationBelongPOs) {
			decorationBelongVOs.add(decorationBelongPO.ptv(new DecorationBelongVO(new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO())));
		}

		return decorationBelongVOs;
	}

}
