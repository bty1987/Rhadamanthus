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
import com.fanglin.inventory.vo.AccessoriesItemVO;
import com.fanglin.inventory.vo.AccessoriesVO;
import com.fanglin.inventory.vo.ManifestItemVO;
import com.fanglin.inventory.vo.ManifestVO;
import com.fanglin.inventory.vo.PurchaseItemVO;
import com.fanglin.inventory.vo.PurchaseVO;
import com.fanglin.sales.vo.SalesVO;
import com.fanglin.utils.Paging;

public interface ManifestService {

	public void pageManifest(Paging paging, List<Filter> filters, int company);

	public ManifestVO queryManifestByMid(ManifestVO manifestVO) throws FLException;

	public List<ManifestVO> queryManifestForPUByPids(List<Long> pids);

	public List<ManifestVO> queryManifestForXGBySid(SalesVO salesVO);

	public int addManifestForCG(ManifestVO manifestVO, List<ManifestItemVO> manifestItemVOs, String userId, int company) throws FLException;

	public int addManifestForXG(ManifestVO manifestVO, List<ManifestItemVO> manifestItemVOs, List<Long> sids, String userId, int company) throws FLException;

	public int addManifestForCR(ManifestVO manifestVO, List<ManifestItemVO> manifestItemVOs, String userId, int company) throws FLException;

	public int addManifestForXB(ManifestVO manifestVO, List<ManifestItemVO> manifestItemVOs, String userId, int company) throws FLException;
	
	public int addManifestForDB(List<ManifestItemVO> manifestItemVOs, String userId, int company) throws FLException;

	public int addManifestForPU(List<PurchaseVO> purchaseVOs, List<PurchaseItemVO> purchaseItemVOs, String uid, int company) throws FLException;

	public int addManifestForAS(List<AccessoriesVO> accessoriesVOs, List<AccessoriesItemVO> accessoriesItemVOs, String userId, int company) throws FLException;
	
	public int addManifestForAR(List<AccessoriesVO> accessoriesVOs, List<AccessoriesItemVO> accessoriesItemVOs, String userId, int company) throws FLException;

	public int addManifestForPS(List<ManifestItemVO> manifestItemVOs, String userId, int company) throws FLException;

	public int addManifestForPM(List<ManifestItemVO> manifestItemVOs, String userId, int company) throws FLException;
	
	public int addManifestForCP(List<ManifestItemVO> manifestItemVOs, String userId, int company)throws FLException;
	
	public int addManifestForCL(List<ManifestItemVO> manifestItemVOs, String userId, int company)throws FLException;

	public int updateManifest(ManifestVO manifestVO) throws FLException;

	public int confirmManifest(ManifestVO manifestVO) throws FLException;

}
