package com.fanglin.payment.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.payment.dao.WalletranDao;
import com.fanglin.payment.po.WalletranPO;
import com.fanglin.payment.service.WalletranService;
import com.fanglin.payment.vo.WalletVO;
import com.fanglin.payment.vo.WalletranVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.Paging;

@Service("walletranService")
@Transactional(readOnly = true)
public class WalletranServiceImpl implements WalletranService {
	
	@Autowired
	private WalletranDao walletranDao;

	@Override
	public void pageWalletran(Paging paging, List<Filter> filters) {
		List<WalletranPO> walletranPOs = walletranDao.pageWalletran(paging, filters);
		List<WalletranVO> walletranVOs = new ArrayList<WalletranVO>();
		
		for (WalletranPO walletranPO : walletranPOs) {
			walletranVOs.add(walletranPO.ptv(new WalletranVO(new WalletVO(new UserBaseVO()), new WalletVO(new UserBaseVO()))));
		}
		
		paging.setData(walletranVOs);

	}

	@Override
	public List<WalletranVO> queryWalletran(WalletranVO walletran) {
		List<WalletranPO> walletranPOs = walletranDao.querywalletran(walletran.getWallet().getWid());
		List<WalletranVO> walletranVOs = new ArrayList<WalletranVO>();
		
		for (WalletranPO walletranPO : walletranPOs) {
			walletranVOs.add(walletranPO.ptv(new WalletranVO(new WalletVO(new UserBaseVO()), new WalletVO(new UserBaseVO()))));
		}
		
		return walletranVOs;
	}
	
}
