package com.fanglin.inventory.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.vo.AccessoriesItemVO;
import com.fanglin.inventory.vo.AccessoriesVO;
import com.fanglin.utils.Paging;

public interface AccessoriesService {

	public void pageAccessories(Paging paging, List<Filter> filters, int company);

	public void pageAccessoriesForSupplier(Paging paging, List<Filter> filters, String userId, AccessoriesVO accessoriesVO);

	public List<AccessoriesVO> queryAccessoriesByOrderId(AccessoriesVO accessoriesVO);

	public AccessoriesVO queryAccessoriesByAid(AccessoriesVO accessoriesVO);

	/**
	 * 结算额公式预览: Σ(辅材结算价data.aoods.balance×辅料项数量)
	 * @param accessoriesVO 需包含aid
	 * @return balance=公式结算额（厘）
	 */
	public AccessoriesVO queryAccessoriesBalance(AccessoriesVO accessoriesVO);

	public int addAccessories(AccessoriesVO accessoriesVO, List<AccessoriesItemVO> accessoriesItemVOs, String userId) throws FLException;

	public int bindAccessories(AccessoriesVO accessoriesVO) throws FLException;

	public int preoutAccessories(AccessoriesVO accessoriesVO, String userId) throws FLException;

	public int cancelAccessories(AccessoriesVO accessoriesVO, String userId) throws FLException;

	public int refuseAccessories(AccessoriesVO accessoriesVO, String userId) throws FLException;

	public int updateAccessoriesForPrint(AccessoriesVO accessoriesVO) throws FLException;

	/**
	 * 标记/取消需分配（属性行为; 已结算单不可标）
	 * @param accessoriesVO 需包含aid与assignFlag(1标记 0取消)
	 */
	public int updateAccessoriesForAssign(AccessoriesVO accessoriesVO) throws FLException;

	public int deliveAccessories(AccessoriesVO accessoriesVO, String userId) throws FLException;

	public int balanceAccessories(AccessoriesVO accessoriesVO, String userId) throws FLException;

	public int auditAccessories(AccessoriesVO accessoriesVO) throws FLException;

}
