package com.fanglin.inventory.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.inventory.dao.PurchaseManifestDao;
import com.fanglin.inventory.po.PurchaseManifestPO;
import com.fanglin.inventory.service.PurchaseManifestService;
import com.fanglin.inventory.vo.ManifestVO;
import com.fanglin.inventory.vo.PurchaseManifestVO;
import com.fanglin.inventory.vo.PurchaseVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;

@Service("purchaseManifestService")
@Transactional(readOnly = true)
public class PurchaseManifestServiceImpl implements PurchaseManifestService{
	
	@Autowired
	private PurchaseManifestDao purchaseManifestDao;

	@Override
	public List<PurchaseManifestVO> queryPurchaseManifestByPids(List<Long> pids){
		
		List<PurchaseManifestVO> purchaseManifestVOs = new ArrayList<PurchaseManifestVO>();
		
		if(pids == null || pids.size()==0){
			return purchaseManifestVOs;
		}
		
		List<PurchaseManifestPO> purchaseManifestPOs = purchaseManifestDao.queryPurchaseManifestByPids(pids);
		
		for(PurchaseManifestPO purchaseManifestPO : purchaseManifestPOs){
			
			PurchaseManifestVO purchaseManifestVO = new PurchaseManifestVO(new PurchaseVO(new UserBaseVO()), new ManifestVO(new UserBaseVO()));
			
			BeanUtil.copyProperties(purchaseManifestPO, purchaseManifestVO, Arrays.asList("purchase","manifest"));
			BeanUtil.copyProperties(purchaseManifestPO.getPurchase(), purchaseManifestVO.getPurchase(), Arrays.asList("user"));
			BeanUtil.copyProperties(purchaseManifestPO.getPurchase().getUser(), purchaseManifestVO.getPurchase().getUser(), Arrays.asList("duty","dept"));
			BeanUtil.copyProperties(purchaseManifestPO.getManifest(), purchaseManifestVO.getManifest(), Arrays.asList("createUser","quoteManifest"));
			BeanUtil.copyProperties(purchaseManifestPO.getManifest().getCreateUser(), purchaseManifestVO.getManifest().getCreateUser(), Arrays.asList("duty","dept"));
			
			purchaseManifestVOs.add(purchaseManifestVO);
			
		}
		
		return purchaseManifestVOs;
		
	}

}
