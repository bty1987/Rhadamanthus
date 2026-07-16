package com.fanglin.balance.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.balance.dao.BalanceSelectionDao;
import com.fanglin.balance.dao.BalanceSelectionItemDao;
import com.fanglin.balance.po.BalanceSelectionItemPO;
import com.fanglin.balance.po.BalanceSelectionPO;
import com.fanglin.balance.service.BalanceSelectionItemService;
import com.fanglin.balance.vo.BalanceSelectionItemVO;
import com.fanglin.balance.vo.BalanceSelectionVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.GoodsKindVO;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.dao.SelectionItemDao;
import com.fanglin.quotation.po.SelectionItemPD;
import com.fanglin.quotation.po.SelectionItemPO;
import com.fanglin.quotation.vo.SelectionItemVO;
import com.fanglin.utils.Paging;

@Service("balanceSelectionItemService")
@Transactional(readOnly = true)
public class BalanceSelectionItemServiceImpl implements BalanceSelectionItemService {

	@Autowired
	private BalanceSelectionItemDao balanceSelectionItemDao;

	@Autowired
	private BalanceSelectionDao balanceSelectionDao;

	@Autowired
	private SelectionItemDao selectionItemDao;

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
	public BalanceSelectionItemVO fetchBalanceSelectionItem(BalanceSelectionItemVO balanceSelectionItemVO) throws FLException {

		// 根据选材项目ID查询选材项目
		BalanceSelectionItemPO balanceSelectionItemPO = balanceSelectionItemDao.queryBalanceSelectionItemBySiid(balanceSelectionItemVO.getSelectionItem().getSiid());

		if (balanceSelectionItemPO == null) {
			throw new FLException(200038, "选材项不存在");
		}

		balanceSelectionItemPO.ptv(balanceSelectionItemVO);

		// 获取关联的结算选材单ID
		long bsid = balanceSelectionItemPO.getBsid();

		// 查询结算选材单
		BalanceSelectionPO balanceSelectionPO = balanceSelectionDao.get(bsid);

		if (balanceSelectionPO == null) {
			throw new FLException(350031, "结算选材单不存在");
		}

		// 转换为 VO
		BalanceSelectionVO balanceSelectionVO = balanceSelectionPO.ptv(new BalanceSelectionVO(null, null, null, null));

		balanceSelectionItemVO.setBalanceSelection(balanceSelectionVO);

		return balanceSelectionItemVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int pendingBalanceSelectionItem(BalanceSelectionVO balanceSelectionVO, BalanceSelectionItemVO balanceSelectionItemVO, String userId, int company) throws FLException {

		BalanceSelectionPO balanceSelectionPO = balanceSelectionDao.get(balanceSelectionVO.getBsid());

		if (balanceSelectionPO == null) {
			throw new FLException(350027, "结算选材不存在");
		}

		if (balanceSelectionPO.getStatus() != BalanceSelectionPO.STATUS_INIT_INT) {
			throw new FLException(350028, "结算选材不可操作");
		}

		BalanceSelectionItemPO balanceSelectionItemPO = balanceSelectionItemDao.get(balanceSelectionItemVO.getBsiid());

		if (balanceSelectionItemPO == null) {
			throw new FLException(200038, "选材项不存在");
		}

		SelectionItemPD selectionItemPD = balanceSelectionItemPO.getSelectionItem();

		if (selectionItemPD == null) {
			throw new FLException(200038, "选材项不存在");
		}

		SelectionItemPO selectionItemPO = selectionItemDao.get(selectionItemPD.getSiid());

		if (selectionItemPO == null) {
			throw new FLException(200038, "选材项不存在");
		}

		selectionItemPO.setAccounter(null);
		selectionItemPO.setAccountTime(null);
		selectionItemPO.setAccountStatus(SelectionItemPO.ACCOUNT_STATUS_PENDING_INT);

		selectionItemDao.update(selectionItemPO);

		balanceSelectionItemDao.delete(balanceSelectionItemPO);

		balanceSelectionItemDao.flush();

		long amount = balanceSelectionDao.amountBalaceSelection(balanceSelectionVO.getBsid());

		balanceSelectionPO.setIncome(balanceSelectionVO.getIncome());
		balanceSelectionPO.setCost(amount);
		balanceSelectionPO.setPayment(amount);
		balanceSelectionPO.setProfit(balanceSelectionVO.getProfit());

		balanceSelectionDao.update(balanceSelectionPO);

		return 0;
	}

	@Override
	public int countBalanceSelectionItem(BalanceSelectionVO balanceSelection) {

		return balanceSelectionItemDao.countBalanceSelectionItem(balanceSelection.getBsid());
	}

}
