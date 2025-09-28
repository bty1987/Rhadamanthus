package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.GoodsKindPO;
import com.fanglin.utils.Paging;

public interface GoodsKindDao extends Dao<GoodsKindPO> {

	public List<GoodsKindPO> pageGoodsKind(Paging paging, List<Filter> filters);

	public List<GoodsKindPO> queryGoodsKind();

	public List<GoodsKindPO> queryGoodsKind(long fgkid);

}
