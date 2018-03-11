/**
 * @File Name		: ManifestService.java
 * @Package   	: com.fanglin.inventory.service
 * @Version		: 1.0
 * @Date			: 2016-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.po.ManifestItemPO;
import com.fanglin.inventory.po.ManifestPO;
import com.fanglin.inventory.vo.AccessoriesItemVO;
import com.fanglin.inventory.vo.AccessoriesVO;
import com.fanglin.inventory.vo.ManifestItemVO;
import com.fanglin.inventory.vo.ManifestVO;
import com.fanglin.inventory.vo.PurchaseItemVO;
import com.fanglin.inventory.vo.PurchaseVO;
import com.fanglin.utils.Paging;

public interface ManifestService {
	
	public void pageManifest(Paging paging, List<Filter> filters,int company);
	
	public ManifestVO queryManifestByMId(ManifestVO manifestVO);
	
	public int addManifestForCG(ManifestVO manifestVO,List<ManifestItemVO> manifestItemVOs,String userId,int company) throws FLException;
	
	public int addManifestForXG(ManifestVO manifestVO,List<Long> sids,List<ManifestItemVO> manifestItemVOs, String userId,int company) throws FLException;
	
	public int addManifestForCR(ManifestVO manifestVO,List<ManifestItemVO> manifestItemVOs,String userId,int company) throws FLException;
	
	public int addManifestForXB(ManifestVO manifestVO,List<ManifestItemVO> manifestItemVOs,String userId,int company) throws FLException;
	
	public int addManifestForPU(List<PurchaseVO> purchaseVOs,List<PurchaseItemVO> purchaseItemVOs,String uid,int company) throws FLException;
	
	public int addManifestForAS(List<AccessoriesVO> accessoriesVOs,List<AccessoriesItemVO> accessoriesItemVOs,String userId,int company) throws FLException;
	
	public int addManifestForPS(List<ManifestItemPO> manifestItemPOs,String userId,int company) throws FLException;
	
	public int addManifestForPM(List<ManifestItemPO> manifestItemPOs,String userId,int company) throws FLException;
	
	public int updateManifest(ManifestVO manifestVO) throws FLException;
	
	public int confirmManifest(ManifestVO manifestVO) throws FLException;
	
	public int addManifestForPackage(List<ManifestItemPO> manifestItemPOs, String comment, ManifestPO manifestPO) throws FLException;
	
}
