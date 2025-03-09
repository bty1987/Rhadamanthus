package com.fanglin.right.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.right.dao.SelectionItemStatusRightDao;
import com.fanglin.right.po.SelectionItemStatusRightPO;
import com.fanglin.right.service.SelectionItemStatusRightService;
import com.fanglin.right.vo.SelectionItemStatusRightVO;
import com.fanglin.utils.BeanUtil;

@Service("selectionItemStatusRightsService")
@Transactional(readOnly = true)
public class SelectionItemStatusRightServiceImpl implements SelectionItemStatusRightService {

	@Autowired
	private SelectionItemStatusRightDao selectionItemStatusRightDao;

	@Override
	public List<SelectionItemStatusRightVO> querySelectionItemStatusRight(SelectionItemStatusRightVO selectionItemStatusRightVO) {

		List<SelectionItemStatusRightPO> selectionItemStatusRightPOs = selectionItemStatusRightDao.querySelectionItemStatusRight(selectionItemStatusRightVO.getBid());
		List<SelectionItemStatusRightVO> selectionItemStatusRightVOs = new ArrayList<SelectionItemStatusRightVO>();

		for (SelectionItemStatusRightPO selectionItemStatusRightPO : selectionItemStatusRightPOs) {

			selectionItemStatusRightVO = new SelectionItemStatusRightVO();

			BeanUtil.copyPropertie(selectionItemStatusRightPO, selectionItemStatusRightVO);

			selectionItemStatusRightVOs.add(selectionItemStatusRightVO);
		}

		return selectionItemStatusRightVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateSelectionItemStatusRight(SelectionItemStatusRightVO selectionItemStatusRightVO, List<SelectionItemStatusRightVO> selectionItemStatusRightVOs) {

		if (selectionItemStatusRightVO == null) return;

		selectionItemStatusRightDao.deleteSelectionItemStatus(selectionItemStatusRightVO.getBid());

		if (selectionItemStatusRightVOs == null) return;

		for (SelectionItemStatusRightVO selectionItemStatusRight : selectionItemStatusRightVOs) {

			SelectionItemStatusRightPO selectionItemStatusRightPO = new SelectionItemStatusRightPO();

			BeanUtil.copyProperties(selectionItemStatusRight, selectionItemStatusRightPO);

			selectionItemStatusRightDao.save(selectionItemStatusRightPO);
		}

	}
}
