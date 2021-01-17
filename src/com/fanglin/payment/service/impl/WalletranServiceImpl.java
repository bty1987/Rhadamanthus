package com.fanglin.payment.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
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
import com.fanglin.utils.BeanUtil;
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
			walletranVOs.add(walletranPOToVO(walletranPO));
		}
		
		paging.setData(walletranVOs);

	}

	@Override
	public List<WalletranVO> queryWalletran(WalletranVO walletran) {
		List<WalletranPO> walletranPOs = walletranDao.querywalletran(walletran.getWallet().getWid());
		List<WalletranVO> walletranVOs = new ArrayList<WalletranVO>();
		
		for (WalletranPO walletranPO : walletranPOs) {
			walletranVOs.add(walletranPOToVO(walletranPO));
		}
		
		return walletranVOs;
	}
	
	public WalletranVO walletranPOToVO(WalletranPO walletranPO) {
		
		WalletranVO walletranVO = new WalletranVO(new WalletVO(new UserBaseVO()), new WalletVO(new UserBaseVO()));
		
		BeanUtil.copyProperties(walletranPO, walletranVO, Arrays.asList("wallet", "tallet"));
		BeanUtil.copyProperties(walletranPO.getWallet(), walletranVO.getWallet(), Arrays.asList("belonger"));
		BeanUtil.copyProperties(walletranPO.getWallet().getBelonger(), walletranVO.getWallet().getBelonger(), Arrays.asList("duty", "dept"));
		if(walletranPO.getTallet() != null){
			BeanUtil.copyProperties(walletranPO.getTallet(), walletranVO.getTallet(), Arrays.asList("belonger"));
			BeanUtil.copyProperties(walletranPO.getTallet().getBelonger(), walletranVO.getTallet().getBelonger(), Arrays.asList("duty", "dept"));
		}
		
		return walletranVO;
		
	}

}
