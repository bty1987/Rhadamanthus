package com.fanglin.balance.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.balance.dao.BalanceSelectionItemDao;
import com.fanglin.balance.po.BalanceSelectionItemPO;
import com.fanglin.balance.service.BalanceSelectionItemService;
import com.fanglin.balance.vo.BalanceSelectionItemVO;
import com.fanglin.balance.vo.BalanceSelectionVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.GoodsKindVO;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.vo.SelectionItemVO;
import com.fanglin.utils.Paging;

@Service("balanceSelectionItemService")
@Transactional(readOnly = true)
public class BalanceSelectionItemServiceImpl implements BalanceSelectionItemService {

	@Autowired
	private BalanceSelectionItemDao balanceSelectionItemDao;

	@Override
	public void pageBalanceSelectionItem(Paging paging, List<Filter> filters, long bsid) throws FLException {

		List<BalanceSelectionItemPO> balanceSelectionItemPOs = balanceSelectionItemDao.pageBalanceSelectionItem(paging, filters, bsid);
		List<BalanceSelectionItemVO> balanceSelectionItemVOs = new ArrayList<BalanceSelectionItemVO>();

		for (BalanceSelectionItemPO balanceSelectionItemPO : balanceSelectionItemPOs) {
			balanceSelectionItemVOs.add(balanceSelectionItemPO.ptv(new BalanceSelectionItemVO(new SelectionItemVO(null, new GoodsVO(null, new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO()), new DecorationVO(), null, null, null, null, null, null, new UserBaseVO(), null, null))));
		}

		paging.setData(balanceSelectionItemVOs);
	}

	@Override
	public List<BalanceSelectionItemVO> queryBalanceSelectionItem(BalanceSelectionItemVO balanceSelectionItem) {

		List<BalanceSelectionItemPO> balanceSelectionItemPOs = balanceSelectionItemDao.queryBalanceSelectionItem(balanceSelectionItem.getBsid());
		List<BalanceSelectionItemVO> balanceSelectionItemVOs = new ArrayList<BalanceSelectionItemVO>();

		for (BalanceSelectionItemPO balanceSelectionItemPO : balanceSelectionItemPOs) {
			balanceSelectionItemVOs.add(balanceSelectionItemPO.ptv(new BalanceSelectionItemVO(new SelectionItemVO(null, new GoodsVO(), new DecorationVO(), null, null, null, null, null, null, new UserBaseVO(), null, null))));
		}

		return balanceSelectionItemVOs;
	}

	@Override
	public int countBalanceSelectionItem(BalanceSelectionVO balanceSelection) {

		return balanceSelectionItemDao.countBalanceSelectionItem(balanceSelection.getBsid());
	}

}
