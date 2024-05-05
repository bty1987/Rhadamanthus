package com.fanglin.balance.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.balance.dao.BalanceSelectionItemDao;
import com.fanglin.balance.po.BalanceSelectionItemPO;
import com.fanglin.balance.service.BalanceSelectionItemService;
import com.fanglin.balance.vo.BalanceSelectionItemVO;
import com.fanglin.balance.vo.BalanceSelectionVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.vo.SelectionItemVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("balanceSelectionItemService")
@Transactional(readOnly = true)
public class BalanceSelectionItemServiceImpl implements BalanceSelectionItemService {

	@Autowired
	private BalanceSelectionItemDao balanceSelectionItemDao;

	@Override
	public void pageBalanceSelectionItem(Paging paging, List<Filter> filters, long bsid) {

		paging.setData(ptv(balanceSelectionItemDao.pageBalanceSelectionItem(paging, filters, bsid)));
	}

	@Override
	public List<BalanceSelectionItemVO> queryBalanceSelectionItem(BalanceSelectionItemVO balanceSelectionItem) {

		return ptv(balanceSelectionItemDao.queryBalanceSelectionItem(balanceSelectionItem.getBsid()));
	}

	@Override
	public int countBalanceSelectionItem(BalanceSelectionVO balanceSelection) {

		return balanceSelectionItemDao.countBalanceSelectionItem(balanceSelection.getBsid());
	}

	private List<BalanceSelectionItemVO> ptv(List<BalanceSelectionItemPO> balanceSelectionItemPOs) {

		List<BalanceSelectionItemVO> balanceSelectionItemVOs = new ArrayList<BalanceSelectionItemVO>();

		BalanceSelectionItemVO balanceSelectionItemVO;

		for (BalanceSelectionItemPO balanceSelectionItemPO : balanceSelectionItemPOs) {

			balanceSelectionItemVO = new BalanceSelectionItemVO(new SelectionItemVO(null, new GoodsVO(), new DecorationVO(), null, null, null, null, null, null, new UserBaseVO(), null, null));

			BeanUtil.copyProperties(balanceSelectionItemPO, balanceSelectionItemVO, Arrays.asList("selectionItem"));

			balanceSelectionItemPO.getSelectionItem().ptv(balanceSelectionItemVO.getSelectionItem());

			balanceSelectionItemPO.getSelectionItem().getDecoration().ptvcascade(balanceSelectionItemVO.getSelectionItem().getDecoration());

			balanceSelectionItemVOs.add(balanceSelectionItemVO);
		}

		return balanceSelectionItemVOs;
	}

}
