package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.dao.InspectItemDao;
import com.fanglin.data.common.service.InspectItemService;
import com.fanglin.data.common.vo.InspectItemVO;
import com.fanglin.data.po.InspectItemPO;
import com.fanglin.utils.BeanUtil;

@Service("inspectItemService")
@Transactional(readOnly = true)
public class InspectItemServiceImpl implements InspectItemService {

	@Autowired
	private InspectItemDao inspectItemDao;

	@Override
	public List<InspectItemVO> queryInspectItem(InspectItemVO inspectItem) {

		List<InspectItemPO> inspectItemPOs = inspectItemDao.queryInspectItem(inspectItem.getIid());
		List<InspectItemVO> inspectItemVOs = new ArrayList<InspectItemVO>();

		for (InspectItemPO inspectItemPO : inspectItemPOs) {

			InspectItemVO inspectItemVO = new InspectItemVO();

			BeanUtil.copyProperties(inspectItemPO, inspectItemVO);

			inspectItemVOs.add(inspectItemVO);

		}

		return inspectItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addInspectItem(InspectItemVO inspectItemVO) {

		InspectItemPO inspectItemPO = new InspectItemPO();

		BeanUtil.copyProperties(inspectItemVO, inspectItemPO);

		inspectItemDao.save(inspectItemPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateInspectItem(InspectItemVO inspectItemVO) throws FLException {

		InspectItemPO inspectItemPO = inspectItemDao.get(inspectItemVO.getIiid());

		if (inspectItemPO == null) {
			throw new FLException(130136, "自检项不存在");
		}

		BeanUtil.copyProperties(inspectItemVO, inspectItemPO);

		inspectItemDao.update(inspectItemPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteInspectItem(InspectItemVO inspectItemVO) throws FLException {
		
		InspectItemPO inspectItemPO = inspectItemDao.get(inspectItemVO.getIiid());

		if (inspectItemPO == null) {
			throw new FLException(130136, "自检项不存在");
		}

		BeanUtil.copyProperties(inspectItemVO, inspectItemPO);

		inspectItemDao.delete(inspectItemPO);

	}
}
