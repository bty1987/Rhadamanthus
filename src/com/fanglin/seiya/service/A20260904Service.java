/**
 * @File Name		: A20260904Service.java
 * @Package   	: com.fanglin.seiya.service
 * @Version		: 1.0
 * @Date			: 2026-09-04
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 库存数据同步服务接口（辅材/仓库/出入库）
 */

package com.fanglin.seiya.service;

import java.util.Map;

import com.fanglin.core.interceptor.FLException;

public interface A20260904Service {

	/**
	 * 同步辅材档案
	 *
	 * 以货号(no, goods.no, 公司维度)为业务键：商品不存在则创建商品（含默认颜色/规格）+ 辅材档案；
	 * 商品存在则更新商品名称/单位，辅材不存在补建、存在更新定额/库房字段（未传字段保持不动）
	 *
	 * @param no 货号（业务唯一键）
	 * @param name 辅材名称
	 * @param measurementUnit 计量单位（可选）
	 * @param normunit 定额单位（可选）
	 * @param normnum 定额数量（可选）
	 * @param storeunit 库房单位（可选）
	 * @param storenum 库房数量（可选）
	 * @param atid 辅材分类ID（可选）
	 * @param company 公司ID
	 * @return 包含 operation(add/update), no, name, aid, gid 等信息的 Map
	 * @throws FLException 业务异常
	 */
	Map<String, Object> syncAoods(String no, String name, String measurementUnit, String normunit, Integer normnum, String storeunit, Integer storenum, Long atid, Integer company) throws FLException;

	/**
	 * 同步仓库档案
	 *
	 * 以仓库编号(code)为业务键：不存在则创建，存在则更新名称/状态
	 *
	 * @param code 仓库编号（唯一键）
	 * @param name 仓库名称
	 * @param status 状态（可选，0 启用/1 停用，缺省 0）
	 * @return 包含 operation(add/update), shid, code, name 等信息的 Map
	 * @throws FLException 业务异常
	 */
	Map<String, Object> syncStorehouse(String code, String name, Integer status) throws FLException;

	/**
	 * 同步出入库（含 manifest 单据信息）
	 *
	 * type=in 入库：库存行不存在自动创建并累加；type=out 出库：库存行不存在或不足直接拒绝
	 * 每次调用生成一张 manifest 单据（in=CG 进货 / out=XG 出货）+ 明细，单事务失败整体回滚
	 *
	 * @param no 货号（须已通过 syncAoods 同步存在）
	 * @param storehouseCode 仓库编号（须已通过 syncStorehouse 同步存在）
	 * @param type 出入库类型：in 入库 / out 出库
	 * @param num 数量（>0）
	 * @param manifestTime 单据时间（可选，yyyy-MM-dd HH:mm:ss，缺省当前时间）
	 * @param comment 备注（可选，落 manifest.comment）
	 * @param company 公司ID
	 * @param userId 操作账号（manifest.creater，来源认证串）
	 * @return 包含 operation(in/out), mid, manifestCode, no, storehouseCode, num(操作后库存) 等信息的 Map
	 * @throws FLException 业务异常
	 */
	Map<String, Object> syncStorehouseStock(String no, String storehouseCode, String type, Integer num, String manifestTime, String comment, Integer company, String userId) throws FLException;

}
