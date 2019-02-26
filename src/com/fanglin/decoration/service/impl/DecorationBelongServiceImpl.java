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
import java.util.Arrays;
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
import com.fanglin.utils.BeanUtil;

@Service("orderBelongInfoService")
@Transactional(readOnly = true)
public class DecorationBelongServiceImpl implements DecorationBelongService {

	@Autowired
	private DecorationBelongDao decorationBelongDao;
	
	@Override
	public List<DecorationBelongVO> queryDecorationBelongByOrderIdAType(String orderId, Short belongType) {

		List<DecorationBelongVO> decorationBelongVOs = new ArrayList<DecorationBelongVO>();
		List<DecorationBelongPO> decorationBelongPOs = decorationBelongDao.queryDecorationBelongByOrderIdAType(orderId, belongType);

		if (decorationBelongPOs == null) {
			return null;
		}

		DecorationBelongVO decorationBelongVO;

		for (DecorationBelongPO decorationBelongPO : decorationBelongPOs) {
			decorationBelongVO = new DecorationBelongVO();

			if (decorationBelongPO.getOperater() != null) {
				decorationBelongVO.setOperater(new UserBaseVO());
				BeanUtil.copyProperties(decorationBelongPO.getOperater(), decorationBelongVO.getOperater(), Arrays.asList("dept", "duty"));

				decorationBelongVO.setOperateTime(decorationBelongPO.getOperateTime());
			}

			decorationBelongVO.setDepartment(new DepartmentVO());
			BeanUtil.copyProperties(decorationBelongPO.getDepartment(), decorationBelongVO.getDepartment(), Arrays.asList("type", "fatherDept", "manager"));

			decorationBelongVO.setRegion(new DepartmentVO());
			if (decorationBelongPO.getBelonger() != null) {
				BeanUtil.copyProperties(decorationBelongPO.getRegion(), decorationBelongVO.getRegion(), Arrays.asList("type", "fatherDept", "manager"));
			} else {
				BeanUtil.copyProperties("", decorationBelongVO.getRegion());
			}
			decorationBelongVO.setBelonger(new UserBaseVO());
			BeanUtil.copyProperties(decorationBelongPO.getBelonger(), decorationBelongVO.getBelonger(), Arrays.asList("dept", "duty"));

			decorationBelongVO.setRate(decorationBelongPO.getRate());
			decorationBelongVO.setType(decorationBelongPO.getType());
			decorationBelongVO.setDbid(decorationBelongPO.getDbid());
			decorationBelongVO.setDefaultFlag(decorationBelongPO.getDefaultFlag());

			decorationBelongVOs.add(decorationBelongVO);
		}

		return decorationBelongVOs;
	}

	@Override
	public List<DecorationBelongVO> queryDecorationBelongForChangeByOrderIdAType(String orderId, Short belongType) {

		List<DecorationBelongVO> decorationBelongVOs = queryDecorationBelongByOrderIdAType(orderId, belongType);

		if (decorationBelongVOs == null || decorationBelongVOs.size() == 0) {
			decorationBelongVOs = queryDecorationBelongForCurrentByOrderIdAType(orderId, belongType);
		}

		return decorationBelongVOs;
	}

	@Override
	public List<DecorationBelongVO> queryDecorationBelongForCurrentByOrderIdAType(String orderId, Short belongType) {

		List<DecorationBelongVO> decorationBelongVOs = new ArrayList<DecorationBelongVO>();
		List<DecorationBelongPO> decorationBelongPOs = decorationBelongDao.queryDecorationBelongForCurrentByOrderIdAType(orderId, belongType);

		DecorationBelongVO decorationBelongVO;

		for (DecorationBelongPO decorationBelongPO : decorationBelongPOs) {
			decorationBelongVO = new DecorationBelongVO();

			if (decorationBelongPO.getOperater() != null) {
				decorationBelongVO.setOperater(new UserBaseVO());
				BeanUtil.copyProperties(decorationBelongPO.getOperater(), decorationBelongVO.getOperater(), Arrays.asList("dept", "duty"));

				decorationBelongVO.setOperateTime(decorationBelongPO.getOperateTime());
			}

			decorationBelongVO.setDepartment(new DepartmentVO());
			BeanUtil.copyProperties(decorationBelongPO.getDepartment(), decorationBelongVO.getDepartment(), Arrays.asList("type", "fatherDept", "manager"));

			decorationBelongVO.setRegion(new DepartmentVO());
			if (decorationBelongPO.getRegion() != null) {
				BeanUtil.copyProperties(decorationBelongPO.getRegion(), decorationBelongVO.getRegion(), Arrays.asList("type", "fatherDept", "manager"));
			} else {
				BeanUtil.copyProperties("", decorationBelongVO.getRegion());
			}
			decorationBelongVO.setBelonger(new UserBaseVO());
			BeanUtil.copyProperties(decorationBelongPO.getBelonger(), decorationBelongVO.getBelonger(), Arrays.asList("dept", "duty"));

			decorationBelongVO.setRate(decorationBelongPO.getRate());
			decorationBelongVO.setType(decorationBelongPO.getType());
			decorationBelongVO.setDbid(decorationBelongPO.getDbid());
			decorationBelongVO.setDefaultFlag(decorationBelongPO.getDefaultFlag());

			decorationBelongVOs.add(decorationBelongVO);
		}

		return decorationBelongVOs;
	}

	@Override
	public List<DecorationBelongVO> queryDecorationBelongByOrderId(DecorationBelongVO decorationBelongVO) {

		List<DecorationBelongVO> decorationBelongVOs = new ArrayList<DecorationBelongVO>();
		List<DecorationBelongPO> decorationBelongPOs = decorationBelongDao.queryDecorationBelongByOrderId(decorationBelongVO.getOrderId());

		for (DecorationBelongPO decorationBelongPO : decorationBelongPOs) {
			decorationBelongVO = new DecorationBelongVO();

			if (decorationBelongPO.getOperater() != null) {
				decorationBelongVO.setOperater(new UserBaseVO());
				BeanUtil.copyProperties(decorationBelongPO.getOperater(), decorationBelongVO.getOperater(), Arrays.asList("dept", "duty"));

				decorationBelongVO.setOperateTime(decorationBelongPO.getOperateTime());
			}

			decorationBelongVO.setDepartment(new DepartmentVO());
			BeanUtil.copyProperties(decorationBelongPO.getDepartment(), decorationBelongVO.getDepartment(), Arrays.asList("type", "fatherDept", "manager"));

			decorationBelongVO.setRegion(new DepartmentVO());
			if (decorationBelongPO.getRegion() != null) {
				BeanUtil.copyProperties(decorationBelongPO.getRegion(), decorationBelongVO.getRegion(), Arrays.asList("type", "fatherDept", "manager"));
			} else {
				BeanUtil.copyProperties("", decorationBelongVO.getRegion());
			}
			decorationBelongVO.setBelonger(new UserBaseVO());
			BeanUtil.copyProperties(decorationBelongPO.getBelonger(), decorationBelongVO.getBelonger(), Arrays.asList("dept", "duty"));

			decorationBelongVO.setRate(decorationBelongPO.getRate());
			decorationBelongVO.setType(decorationBelongPO.getType());
			decorationBelongVO.setDbid(decorationBelongPO.getDbid());
			decorationBelongVO.setDefaultFlag(decorationBelongPO.getDefaultFlag());

			decorationBelongVOs.add(decorationBelongVO);
		}

		return decorationBelongVOs;
	}

}
