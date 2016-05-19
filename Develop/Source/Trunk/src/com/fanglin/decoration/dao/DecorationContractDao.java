/**
 * @File Name		: DecorationContractDao
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  mzy
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.decoration.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.decoration.po.DecorationContractPO;
import com.fanglin.utils.Paging;

public interface DecorationContractDao extends Dao<DecorationContractPO> {

	public List<DecorationContractPO> pageDecorationContract(Paging paging, List<FilterVO> filters);

	public DecorationContractPO queryDecorationContractByOrderId(String orderId);
}
