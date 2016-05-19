/**
 * @File Name		: MaterialSubOrderRefundDao.java
 * @Package   	: com.fanglin.dao.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-10-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.material.po.MaterialSubOrderRefundPO;
import com.fanglin.utils.Paging;

public interface MaterialSubOrderRefundDao extends Dao<MaterialSubOrderRefundPO> {
	
	public List<MaterialSubOrderRefundPO> pageMaterialSubOrderRefundByMsoId(Paging paging, List<FilterVO> filters, long msoId);
	
	public List<MaterialSubOrderRefundPO> queryMaterialSubOrderRefundByMsoId(long msoId);
	
	public List<MaterialSubOrderRefundPO> queryMaterialSubOrderRefundByMsoIdIdents(long msoId, List<Integer> idents);
	
	public MaterialSubOrderRefundPO queryMaterialSubOrderRefundByMsoiId(long msoiId);
	
	public List<MaterialSubOrderRefundPO> queryMaterialSubOrderRefundByMpId(long mpId);

}
