/*
 Navicat Premium Data Transfer

 Source Server         : 12
 Source Server Type    : MySQL
 Source Server Version : 80031
 Source Host           : 121.43.43.59:3306
 Source Schema         : lim-db

 Target Server Type    : MySQL
 Target Server Version : 80031
 File Encoding         : 65001

 Date: 28/02/2023 10:45:42
*/
CREATE DATABASE `lim-db` CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci';
use `lim-db`;
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for api_case
-- ----------------------------
DROP TABLE IF EXISTS `api_case`;
CREATE TABLE `api_case`  (
  `created` datetime(6) NOT NULL,
  `updated` datetime(6) NULL DEFAULT NULL,
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `status` int(0) NOT NULL,
  `remark` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `report_data` json NULL,
  `is_deleted` tinyint(1) NOT NULL,
  `latest_run_time` datetime(6) NULL DEFAULT NULL,
  `creater_id` bigint(0) NOT NULL,
  `module_id` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `updater_id` bigint(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `api_case_name_module_id_13060238_uniq`(`name`, `module_id`) USING BTREE,
  INDEX `api_case_creater_id_a6d3af6d_fk_auth_user_id`(`creater_id`) USING BTREE,
  INDEX `api_case_module_id_3d0f4073_fk_api_case_module_id`(`module_id`) USING BTREE,
  INDEX `api_case_updater_id_a62fb5d0_fk_auth_user_id`(`updater_id`) USING BTREE,
  CONSTRAINT `api_case_creater_id_a6d3af6d_fk_auth_user_id` FOREIGN KEY (`creater_id`) REFERENCES `auth_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `api_case_module_id_3d0f4073_fk_api_case_module_id` FOREIGN KEY (`module_id`) REFERENCES `api_case_module` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `api_case_updater_id_a62fb5d0_fk_auth_user_id` FOREIGN KEY (`updater_id`) REFERENCES `auth_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of api_case
-- ----------------------------

-- ----------------------------
-- Table structure for api_case_module
-- ----------------------------
DROP TABLE IF EXISTS `api_case_module`;
CREATE TABLE `api_case_module`  (
  `created` datetime(6) NOT NULL,
  `updated` datetime(6) NULL DEFAULT NULL,
  `id` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `module_related` json NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `parent_id` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `api_case_module_parent_id_cdd5cd0e_fk_api_case_module_id`(`parent_id`) USING BTREE,
  CONSTRAINT `api_case_module_parent_id_cdd5cd0e_fk_api_case_module_id` FOREIGN KEY (`parent_id`) REFERENCES `api_case_module` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of api_case_module
-- ----------------------------

-- ----------------------------
-- Table structure for api_case_step
-- ----------------------------
DROP TABLE IF EXISTS `api_case_step`;
CREATE TABLE `api_case_step`  (
  `step_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `status` int(0) NOT NULL,
  `params` json NULL,
  `enabled` tinyint(1) NOT NULL,
  `controller_data` json NULL,
  `retried_times` smallint(0) NULL DEFAULT NULL,
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `results` json NULL,
  `api_id` int(0) NULL DEFAULT NULL,
  `case_id` int(0) NOT NULL,
  `quote_case_id` int(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `api_case_step_api_id_2ec3529e_fk_api_data_id`(`api_id`) USING BTREE,
  INDEX `api_case_step_case_id_d7437793_fk_api_case_id`(`case_id`) USING BTREE,
  INDEX `api_case_step_quote_case_id_b94ec3d7_fk_api_case_id`(`quote_case_id`) USING BTREE,
  CONSTRAINT `api_case_step_api_id_2ec3529e_fk_api_data_id` FOREIGN KEY (`api_id`) REFERENCES `api_data` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `api_case_step_case_id_d7437793_fk_api_case_id` FOREIGN KEY (`case_id`) REFERENCES `api_case` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `api_case_step_quote_case_id_b94ec3d7_fk_api_case_id` FOREIGN KEY (`quote_case_id`) REFERENCES `api_case` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of api_case_step
-- ----------------------------

-- ----------------------------
-- Table structure for api_data
-- ----------------------------
DROP TABLE IF EXISTS `api_data`;
CREATE TABLE `api_data`  (
  `created` datetime(6) NOT NULL,
  `updated` datetime(6) NULL DEFAULT NULL,
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `method` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `status` int(0) NOT NULL,
  `default_params` json NULL,
  `timeout` smallint(0) NULL DEFAULT NULL,
  `source` smallint(0) NOT NULL,
  `creater_id` bigint(0) NOT NULL,
  `module_id` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `project_id` smallint(0) NOT NULL,
  `updater_id` bigint(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `api_data_project_id_path_method_ca9681c4_uniq`(`project_id`, `path`, `method`) USING BTREE,
  INDEX `api_data_creater_id_da4767aa_fk_auth_user_id`(`creater_id`) USING BTREE,
  INDEX `api_data_module_id_e102881f_fk_api_module_id`(`module_id`) USING BTREE,
  INDEX `api_data_updater_id_2b8c1332_fk_auth_user_id`(`updater_id`) USING BTREE,
  CONSTRAINT `api_data_creater_id_da4767aa_fk_auth_user_id` FOREIGN KEY (`creater_id`) REFERENCES `auth_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `api_data_module_id_e102881f_fk_api_module_id` FOREIGN KEY (`module_id`) REFERENCES `api_module` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `api_data_project_id_b935f310_fk_project_id` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `api_data_updater_id_2b8c1332_fk_auth_user_id` FOREIGN KEY (`updater_id`) REFERENCES `auth_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of api_data
-- ----------------------------

-- ----------------------------
-- Table structure for api_foreach_step
-- ----------------------------
DROP TABLE IF EXISTS `api_foreach_step`;
CREATE TABLE `api_foreach_step`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `step_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `status` int(0) NOT NULL,
  `params` json NULL,
  `enabled` tinyint(1) NOT NULL,
  `controller_data` json NULL,
  `retried_times` smallint(0) NULL DEFAULT NULL,
  `api_id` int(0) NULL DEFAULT NULL,
  `parent_id` int(0) NULL DEFAULT NULL,
  `quote_case_id` int(0) NULL DEFAULT NULL,
  `step_id` int(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `api_foreach_step_api_id_acbf4a48_fk_api_data_id`(`api_id`) USING BTREE,
  INDEX `api_foreach_step_parent_id_bb5bc602_fk_api_foreach_step_id`(`parent_id`) USING BTREE,
  INDEX `api_foreach_step_quote_case_id_4fef398d_fk_api_case_id`(`quote_case_id`) USING BTREE,
  INDEX `api_foreach_step_step_id_268f4920_fk_api_case_step_id`(`step_id`) USING BTREE,
  CONSTRAINT `api_foreach_step_api_id_acbf4a48_fk_api_data_id` FOREIGN KEY (`api_id`) REFERENCES `api_data` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `api_foreach_step_parent_id_bb5bc602_fk_api_foreach_step_id` FOREIGN KEY (`parent_id`) REFERENCES `api_foreach_step` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `api_foreach_step_quote_case_id_4fef398d_fk_api_case_id` FOREIGN KEY (`quote_case_id`) REFERENCES `api_case` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `api_foreach_step_step_id_268f4920_fk_api_case_step_id` FOREIGN KEY (`step_id`) REFERENCES `api_case_step` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of api_foreach_step
-- ----------------------------

-- ----------------------------
-- Table structure for api_module
-- ----------------------------
DROP TABLE IF EXISTS `api_module`;
CREATE TABLE `api_module`  (
  `created` datetime(6) NOT NULL,
  `updated` datetime(6) NULL DEFAULT NULL,
  `id` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `module_related` json NOT NULL,
  `parent_id` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `project_id` smallint(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `api_module_parent_id_df46aaf7_fk_api_module_id`(`parent_id`) USING BTREE,
  INDEX `api_module_project_id_528bc9a0_fk_project_id`(`project_id`) USING BTREE,
  CONSTRAINT `api_module_parent_id_df46aaf7_fk_api_module_id` FOREIGN KEY (`parent_id`) REFERENCES `api_module` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `api_module_project_id_528bc9a0_fk_project_id` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of api_module
-- ----------------------------
INSERT INTO `api_module` VALUES ('2023-02-28 02:28:09.087477', '2023-02-28 02:28:09.087477', 'APM00000001', '默认模块', '[]', NULL, 1);

-- ----------------------------
-- Table structure for auth_group
-- ----------------------------
DROP TABLE IF EXISTS `auth_group`;
CREATE TABLE `auth_group`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `name`(`name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of auth_group
-- ----------------------------

-- ----------------------------
-- Table structure for auth_group_permissions
-- ----------------------------
DROP TABLE IF EXISTS `auth_group_permissions`;
CREATE TABLE `auth_group_permissions`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `group_id` int(0) NOT NULL,
  `permission_id` int(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `auth_group_permissions_group_id_permission_id_0cd325b0_uniq`(`group_id`, `permission_id`) USING BTREE,
  INDEX `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm`(`permission_id`) USING BTREE,
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of auth_group_permissions
-- ----------------------------

-- ----------------------------
-- Table structure for auth_permission
-- ----------------------------
DROP TABLE IF EXISTS `auth_permission`;
CREATE TABLE `auth_permission`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `content_type_id` int(0) NOT NULL,
  `codename` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `auth_permission_content_type_id_codename_01ab375a_uniq`(`content_type_id`, `codename`) USING BTREE,
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 65 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of auth_permission
-- ----------------------------
INSERT INTO `auth_permission` VALUES (1, 'Can add 用户', 1, 'add_limuser');
INSERT INTO `auth_permission` VALUES (2, 'Can change 用户', 1, 'change_limuser');
INSERT INTO `auth_permission` VALUES (3, 'Can delete 用户', 1, 'delete_limuser');
INSERT INTO `auth_permission` VALUES (4, 'Can view 用户', 1, 'view_limuser');
INSERT INTO `auth_permission` VALUES (5, 'Can add 用户临时参数', 2, 'add_usertempparams');
INSERT INTO `auth_permission` VALUES (6, 'Can change 用户临时参数', 2, 'change_usertempparams');
INSERT INTO `auth_permission` VALUES (7, 'Can delete 用户临时参数', 2, 'delete_usertempparams');
INSERT INTO `auth_permission` VALUES (8, 'Can view 用户临时参数', 2, 'view_usertempparams');
INSERT INTO `auth_permission` VALUES (9, 'Can add 用户配置数据', 3, 'add_usercfg');
INSERT INTO `auth_permission` VALUES (10, 'Can change 用户配置数据', 3, 'change_usercfg');
INSERT INTO `auth_permission` VALUES (11, 'Can delete 用户配置数据', 3, 'delete_usercfg');
INSERT INTO `auth_permission` VALUES (12, 'Can view 用户配置数据', 3, 'view_usercfg');
INSERT INTO `auth_permission` VALUES (13, 'Can add 项目表', 4, 'add_project');
INSERT INTO `auth_permission` VALUES (14, 'Can change 项目表', 4, 'change_project');
INSERT INTO `auth_permission` VALUES (15, 'Can delete 项目表', 4, 'delete_project');
INSERT INTO `auth_permission` VALUES (16, 'Can view 项目表', 4, 'view_project');
INSERT INTO `auth_permission` VALUES (17, 'Can add 项目表', 5, 'add_projectenvirdata');
INSERT INTO `auth_permission` VALUES (18, 'Can change 项目表', 5, 'change_projectenvirdata');
INSERT INTO `auth_permission` VALUES (19, 'Can delete 项目表', 5, 'delete_projectenvirdata');
INSERT INTO `auth_permission` VALUES (20, 'Can view 项目表', 5, 'view_projectenvirdata');
INSERT INTO `auth_permission` VALUES (21, 'Can add 接口用例', 6, 'add_apicase');
INSERT INTO `auth_permission` VALUES (22, 'Can change 接口用例', 6, 'change_apicase');
INSERT INTO `auth_permission` VALUES (23, 'Can delete 接口用例', 6, 'delete_apicase');
INSERT INTO `auth_permission` VALUES (24, 'Can view 接口用例', 6, 'view_apicase');
INSERT INTO `auth_permission` VALUES (25, 'Can add 用例模块', 7, 'add_apicasemodule');
INSERT INTO `auth_permission` VALUES (26, 'Can change 用例模块', 7, 'change_apicasemodule');
INSERT INTO `auth_permission` VALUES (27, 'Can delete 用例模块', 7, 'delete_apicasemodule');
INSERT INTO `auth_permission` VALUES (28, 'Can view 用例模块', 7, 'view_apicasemodule');
INSERT INTO `auth_permission` VALUES (29, 'Can add api用例的步骤', 8, 'add_apicasestep');
INSERT INTO `auth_permission` VALUES (30, 'Can change api用例的步骤', 8, 'change_apicasestep');
INSERT INTO `auth_permission` VALUES (31, 'Can delete api用例的步骤', 8, 'delete_apicasestep');
INSERT INTO `auth_permission` VALUES (32, 'Can view api用例的步骤', 8, 'view_apicasestep');
INSERT INTO `auth_permission` VALUES (33, 'Can add api用例', 9, 'add_apidata');
INSERT INTO `auth_permission` VALUES (34, 'Can change api用例', 9, 'change_apidata');
INSERT INTO `auth_permission` VALUES (35, 'Can delete api用例', 9, 'delete_apidata');
INSERT INTO `auth_permission` VALUES (36, 'Can view api用例', 9, 'view_apidata');
INSERT INTO `auth_permission` VALUES (37, 'Can add 用例模块', 10, 'add_apimodule');
INSERT INTO `auth_permission` VALUES (38, 'Can change 用例模块', 10, 'change_apimodule');
INSERT INTO `auth_permission` VALUES (39, 'Can delete 用例模块', 10, 'delete_apimodule');
INSERT INTO `auth_permission` VALUES (40, 'Can view 用例模块', 10, 'view_apimodule');
INSERT INTO `auth_permission` VALUES (41, 'Can add api用例的步骤', 11, 'add_apiforeachstep');
INSERT INTO `auth_permission` VALUES (42, 'Can change api用例的步骤', 11, 'change_apiforeachstep');
INSERT INTO `auth_permission` VALUES (43, 'Can delete api用例的步骤', 11, 'delete_apiforeachstep');
INSERT INTO `auth_permission` VALUES (44, 'Can view api用例的步骤', 11, 'view_apiforeachstep');
INSERT INTO `auth_permission` VALUES (45, 'Can add 环境配置字典表', 12, 'add_confenvir');
INSERT INTO `auth_permission` VALUES (46, 'Can change 环境配置字典表', 12, 'change_confenvir');
INSERT INTO `auth_permission` VALUES (47, 'Can delete 环境配置字典表', 12, 'delete_confenvir');
INSERT INTO `auth_permission` VALUES (48, 'Can view 环境配置字典表', 12, 'view_confenvir');
INSERT INTO `auth_permission` VALUES (49, 'Can add 参数类型表', 13, 'add_confparamtype');
INSERT INTO `auth_permission` VALUES (50, 'Can change 参数类型表', 13, 'change_confparamtype');
INSERT INTO `auth_permission` VALUES (51, 'Can delete 参数类型表', 13, 'delete_confparamtype');
INSERT INTO `auth_permission` VALUES (52, 'Can view 参数类型表', 13, 'view_confparamtype');
INSERT INTO `auth_permission` VALUES (53, 'Can add permission', 14, 'add_permission');
INSERT INTO `auth_permission` VALUES (54, 'Can change permission', 14, 'change_permission');
INSERT INTO `auth_permission` VALUES (55, 'Can delete permission', 14, 'delete_permission');
INSERT INTO `auth_permission` VALUES (56, 'Can view permission', 14, 'view_permission');
INSERT INTO `auth_permission` VALUES (57, 'Can add group', 15, 'add_group');
INSERT INTO `auth_permission` VALUES (58, 'Can change group', 15, 'change_group');
INSERT INTO `auth_permission` VALUES (59, 'Can delete group', 15, 'delete_group');
INSERT INTO `auth_permission` VALUES (60, 'Can view group', 15, 'view_group');
INSERT INTO `auth_permission` VALUES (61, 'Can add content type', 16, 'add_contenttype');
INSERT INTO `auth_permission` VALUES (62, 'Can change content type', 16, 'change_contenttype');
INSERT INTO `auth_permission` VALUES (63, 'Can delete content type', 16, 'delete_contenttype');
INSERT INTO `auth_permission` VALUES (64, 'Can view content type', 16, 'view_contenttype');
INSERT INTO `auth_permission` VALUES (65, 'Can add log entry', 17, 'add_logentry');
INSERT INTO `auth_permission` VALUES (66, 'Can change log entry', 17, 'change_logentry');
INSERT INTO `auth_permission` VALUES (67, 'Can delete log entry', 17, 'delete_logentry');
INSERT INTO `auth_permission` VALUES (68, 'Can view log entry', 17, 'view_logentry');
INSERT INTO `auth_permission` VALUES (69, 'Can add session', 18, 'add_session');
INSERT INTO `auth_permission` VALUES (70, 'Can change session', 18, 'change_session');
INSERT INTO `auth_permission` VALUES (71, 'Can delete session', 18, 'delete_session');
INSERT INTO `auth_permission` VALUES (72, 'Can view session', 18, 'view_session');
INSERT INTO `auth_permission` VALUES (73, 'Can add Token', 19, 'add_token');
INSERT INTO `auth_permission` VALUES (74, 'Can change Token', 19, 'change_token');
INSERT INTO `auth_permission` VALUES (75, 'Can delete Token', 19, 'delete_token');
INSERT INTO `auth_permission` VALUES (76, 'Can view Token', 19, 'view_token');
INSERT INTO `auth_permission` VALUES (77, 'Can add token', 20, 'add_tokenproxy');
INSERT INTO `auth_permission` VALUES (78, 'Can change token', 20, 'change_tokenproxy');
INSERT INTO `auth_permission` VALUES (79, 'Can delete token', 20, 'delete_tokenproxy');
INSERT INTO `auth_permission` VALUES (80, 'Can view token', 20, 'view_tokenproxy');

-- ----------------------------
-- Table structure for auth_user
-- ----------------------------
DROP TABLE IF EXISTS `auth_user`;
CREATE TABLE `auth_user`  (
  `id` bigint(0) NOT NULL AUTO_INCREMENT,
  `password` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `last_login` datetime(6) NULL DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `first_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `last_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(254) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  `real_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of auth_user
-- ----------------------------
INSERT INTO `auth_user` VALUES (1, 'pbkdf2_sha256$390000$wpdawNck2yquKHx0l5A7rJ$n7Tjl165CMhUqMB15+VpVKRs0J9INm9QPKP12ili0TY=', NULL, 1, 'admin', '理员', '管', '', 1, 1, '2023-02-28 00:00:00.000000', '曲鸟');
INSERT INTO `auth_user` VALUES (2, 'pbkdf2_sha256$390000$dKvpPlT1hWLwTwo4h89xFN$PGW4wqz4UGy70tCeurxotzheCwAhJ4+tKMPJAvmzBMw=', NULL, 0, 'test', '', '', '', 0, 1, '2023-02-28 01:27:49.349741', '王牌测试');

-- ----------------------------
-- Table structure for auth_user_groups
-- ----------------------------
DROP TABLE IF EXISTS `auth_user_groups`;
CREATE TABLE `auth_user_groups`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `limuser_id` bigint(0) NOT NULL,
  `group_id` int(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `auth_user_groups_limuser_id_group_id_35162d7b_uniq`(`limuser_id`, `group_id`) USING BTREE,
  INDEX `auth_user_groups_group_id_97559544_fk_auth_group_id`(`group_id`) USING BTREE,
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `auth_user_groups_limuser_id_0977be3a_fk_auth_user_id` FOREIGN KEY (`limuser_id`) REFERENCES `auth_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of auth_user_groups
-- ----------------------------

-- ----------------------------
-- Table structure for auth_user_user_permissions
-- ----------------------------
DROP TABLE IF EXISTS `auth_user_user_permissions`;
CREATE TABLE `auth_user_user_permissions`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `limuser_id` bigint(0) NOT NULL,
  `permission_id` int(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `auth_user_user_permissio_limuser_id_permission_id_6f64d8c0_uniq`(`limuser_id`, `permission_id`) USING BTREE,
  INDEX `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm`(`permission_id`) USING BTREE,
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `auth_user_user_permissions_limuser_id_7a85b01b_fk_auth_user_id` FOREIGN KEY (`limuser_id`) REFERENCES `auth_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of auth_user_user_permissions
-- ----------------------------

-- ----------------------------
-- Table structure for authtoken_token
-- ----------------------------
DROP TABLE IF EXISTS `authtoken_token`;
CREATE TABLE `authtoken_token`  (
  `key` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created` datetime(6) NOT NULL,
  `user_id` bigint(0) NOT NULL,
  PRIMARY KEY (`key`) USING BTREE,
  UNIQUE INDEX `user_id`(`user_id`) USING BTREE,
  CONSTRAINT `authtoken_token_user_id_35299eff_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of authtoken_token
-- ----------------------------
INSERT INTO `authtoken_token` VALUES ('331d4695ac7c0f8ca2cde2504a18046eafd9801e', '2023-02-28 02:26:29.234917', 1);

-- ----------------------------
-- Table structure for conf_envir
-- ----------------------------
DROP TABLE IF EXISTS `conf_envir`;
CREATE TABLE `conf_envir`  (
  `id` smallint(0) NOT NULL AUTO_INCREMENT,
  `position` smallint(0) NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `name`(`name`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of conf_envir
-- ----------------------------
INSERT INTO `conf_envir` VALUES (1, 1, '默认环境');

-- ----------------------------
-- Table structure for conf_param_type
-- ----------------------------
DROP TABLE IF EXISTS `conf_param_type`;
CREATE TABLE `conf_param_type`  (
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `position` smallint(0) NOT NULL,
  `id` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of conf_param_type
-- ----------------------------
INSERT INTO `conf_param_type` VALUES ('字符串(string)', 1, '1');
INSERT INTO `conf_param_type` VALUES ('对象(object)', 2, '2');
INSERT INTO `conf_param_type` VALUES ('数字(int/float)', 3, '3');
INSERT INTO `conf_param_type` VALUES ('布尔(boolean)', 4, '4');

-- ----------------------------
-- Table structure for django_admin_log
-- ----------------------------
DROP TABLE IF EXISTS `django_admin_log`;
CREATE TABLE `django_admin_log`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `object_repr` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `action_flag` smallint(0) UNSIGNED NOT NULL,
  `change_message` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `content_type_id` int(0) NULL DEFAULT NULL,
  `user_id` bigint(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `django_admin_log_content_type_id_c4bce8eb_fk_django_co`(`content_type_id`) USING BTREE,
  INDEX `django_admin_log_user_id_c564eba6_fk_auth_user_id`(`user_id`) USING BTREE,
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of django_admin_log
-- ----------------------------

-- ----------------------------
-- Table structure for django_content_type
-- ----------------------------
DROP TABLE IF EXISTS `django_content_type`;
CREATE TABLE `django_content_type`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `model` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `django_content_type_app_label_model_76bd3d3b_uniq`(`app_label`, `model`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of django_content_type
-- ----------------------------
INSERT INTO `django_content_type` VALUES (17, 'admin', 'logentry');
INSERT INTO `django_content_type` VALUES (6, 'apiData', 'apicase');
INSERT INTO `django_content_type` VALUES (7, 'apiData', 'apicasemodule');
INSERT INTO `django_content_type` VALUES (8, 'apiData', 'apicasestep');
INSERT INTO `django_content_type` VALUES (9, 'apiData', 'apidata');
INSERT INTO `django_content_type` VALUES (11, 'apiData', 'apiforeachstep');
INSERT INTO `django_content_type` VALUES (10, 'apiData', 'apimodule');
INSERT INTO `django_content_type` VALUES (15, 'auth', 'group');
INSERT INTO `django_content_type` VALUES (14, 'auth', 'permission');
INSERT INTO `django_content_type` VALUES (19, 'authtoken', 'token');
INSERT INTO `django_content_type` VALUES (20, 'authtoken', 'tokenproxy');
INSERT INTO `django_content_type` VALUES (12, 'conf', 'confenvir');
INSERT INTO `django_content_type` VALUES (13, 'conf', 'confparamtype');
INSERT INTO `django_content_type` VALUES (16, 'contenttypes', 'contenttype');
INSERT INTO `django_content_type` VALUES (4, 'project', 'project');
INSERT INTO `django_content_type` VALUES (5, 'project', 'projectenvirdata');
INSERT INTO `django_content_type` VALUES (18, 'sessions', 'session');
INSERT INTO `django_content_type` VALUES (1, 'user', 'limuser');
INSERT INTO `django_content_type` VALUES (3, 'user', 'usercfg');
INSERT INTO `django_content_type` VALUES (2, 'user', 'usertempparams');

-- ----------------------------
-- Table structure for django_migrations
-- ----------------------------
DROP TABLE IF EXISTS `django_migrations`;
CREATE TABLE `django_migrations`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `app` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 31 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of django_migrations
-- ----------------------------
INSERT INTO `django_migrations` VALUES (1, 'user', '0001_initial', '2023-02-28 02:25:32.520642');
INSERT INTO `django_migrations` VALUES (2, 'contenttypes', '0001_initial', '2023-02-28 02:25:32.720138');
INSERT INTO `django_migrations` VALUES (3, 'project', '0001_initial', '2023-02-28 02:25:32.800894');
INSERT INTO `django_migrations` VALUES (4, 'conf', '0001_initial', '2023-02-28 02:25:32.880680');
INSERT INTO `django_migrations` VALUES (5, 'conf', '0002_initial', '2023-02-28 02:25:33.086131');
INSERT INTO `django_migrations` VALUES (6, 'project', '0002_initial', '2023-02-28 02:25:33.603747');
INSERT INTO `django_migrations` VALUES (7, 'apiData', '0001_initial', '2023-02-28 02:25:33.683533');
INSERT INTO `django_migrations` VALUES (8, 'apiData', '0002_initial', '2023-02-28 02:25:34.940173');
INSERT INTO `django_migrations` VALUES (9, 'contenttypes', '0002_remove_content_type_name', '2023-02-28 02:25:35.269321');
INSERT INTO `django_migrations` VALUES (10, 'auth', '0001_initial', '2023-02-28 02:25:36.032281');
INSERT INTO `django_migrations` VALUES (11, 'auth', '0002_alter_permission_name_max_length', '2023-02-28 02:25:36.209778');
INSERT INTO `django_migrations` VALUES (12, 'auth', '0003_alter_user_email_max_length', '2023-02-28 02:25:36.292557');
INSERT INTO `django_migrations` VALUES (13, 'auth', '0004_alter_user_username_opts', '2023-02-28 02:25:36.376333');
INSERT INTO `django_migrations` VALUES (14, 'auth', '0005_alter_user_last_login_null', '2023-02-28 02:25:36.461106');
INSERT INTO `django_migrations` VALUES (15, 'auth', '0006_require_contenttypes_0002', '2023-02-28 02:25:36.539895');
INSERT INTO `django_migrations` VALUES (16, 'auth', '0007_alter_validators_add_error_messages', '2023-02-28 02:25:36.624669');
INSERT INTO `django_migrations` VALUES (17, 'auth', '0008_alter_user_username_max_length', '2023-02-28 02:25:36.707447');
INSERT INTO `django_migrations` VALUES (18, 'auth', '0009_alter_user_last_name_max_length', '2023-02-28 02:25:36.791223');
INSERT INTO `django_migrations` VALUES (19, 'auth', '0010_alter_group_name_max_length', '2023-02-28 02:25:36.925863');
INSERT INTO `django_migrations` VALUES (20, 'auth', '0011_update_proxy_permissions', '2023-02-28 02:25:37.126327');
INSERT INTO `django_migrations` VALUES (21, 'auth', '0012_alter_user_first_name_max_length', '2023-02-28 02:25:37.209106');
INSERT INTO `django_migrations` VALUES (22, 'user', '0002_initial', '2023-02-28 02:25:38.900583');
INSERT INTO `django_migrations` VALUES (23, 'admin', '0001_initial', '2023-02-28 02:25:48.221658');
INSERT INTO `django_migrations` VALUES (24, 'admin', '0002_logentry_remove_auto_add', '2023-02-28 02:25:48.307428');
INSERT INTO `django_migrations` VALUES (25, 'admin', '0003_logentry_add_action_flag_choices', '2023-02-28 02:25:48.395194');
INSERT INTO `django_migrations` VALUES (26, 'apiData', '0003_initial', '2023-02-28 02:25:50.858607');
INSERT INTO `django_migrations` VALUES (27, 'authtoken', '0001_initial', '2023-02-28 02:25:51.122899');
INSERT INTO `django_migrations` VALUES (28, 'authtoken', '0002_auto_20160226_1747', '2023-02-28 02:25:51.237593');
INSERT INTO `django_migrations` VALUES (29, 'authtoken', '0003_tokenproxy', '2023-02-28 02:25:51.322367');
INSERT INTO `django_migrations` VALUES (30, 'sessions', '0001_initial', '2023-02-28 02:25:51.578681');

-- ----------------------------
-- Table structure for django_session
-- ----------------------------
DROP TABLE IF EXISTS `django_session`;
CREATE TABLE `django_session`  (
  `session_key` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `session_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`) USING BTREE,
  INDEX `django_session_expire_date_a5c62663`(`expire_date`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of django_session
-- ----------------------------

-- ----------------------------
-- Table structure for project
-- ----------------------------
DROP TABLE IF EXISTS `project`;
CREATE TABLE `project`  (
  `created` datetime(6) NOT NULL,
  `updated` datetime(6) NULL DEFAULT NULL,
  `id` smallint(0) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `remark` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `name`(`name`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of project
-- ----------------------------
INSERT INTO `project` VALUES ('2023-02-28 02:28:09.011727', '2023-02-28 02:41:28.141833', 1, '默认项目', NULL);

-- ----------------------------
-- Table structure for project_envir_data
-- ----------------------------
DROP TABLE IF EXISTS `project_envir_data`;
CREATE TABLE `project_envir_data`  (
  `id` smallint(0) NOT NULL AUTO_INCREMENT,
  `data` json NULL,
  `envir_id` smallint(0) NOT NULL,
  `project_id` smallint(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `project_envir_data_envir_id_project_id_0bdc6da1_uniq`(`envir_id`, `project_id`) USING BTREE,
  INDEX `project_envir_data_project_id_0ae43cb2_fk_project_id`(`project_id`) USING BTREE,
  CONSTRAINT `project_envir_data_envir_id_5710b654_fk_conf_envir_id` FOREIGN KEY (`envir_id`) REFERENCES `conf_envir` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `project_envir_data_project_id_0ae43cb2_fk_project_id` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of project_envir_data
-- ----------------------------

-- ----------------------------
-- Table structure for user_cfg
-- ----------------------------
DROP TABLE IF EXISTS `user_cfg`;
CREATE TABLE `user_cfg`  (
  `user_id` bigint(0) NOT NULL,
  `failed_stop` tinyint(1) NOT NULL,
  `only_failed_log` tinyint(1) NOT NULL,
  `exec_status` smallint(0) NOT NULL,
  `envir_id` smallint(0) NOT NULL,
  PRIMARY KEY (`user_id`) USING BTREE,
  INDEX `user_cfg_envir_id_478f5f1f_fk_conf_envir_id`(`envir_id`) USING BTREE,
  CONSTRAINT `user_cfg_envir_id_478f5f1f_fk_conf_envir_id` FOREIGN KEY (`envir_id`) REFERENCES `conf_envir` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `user_cfg_user_id_2b708387_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_cfg
-- ----------------------------

-- ----------------------------
-- Table structure for user_temp_params
-- ----------------------------
DROP TABLE IF EXISTS `user_temp_params`;
CREATE TABLE `user_temp_params`  (
  `id` bigint(0) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `value` json NULL,
  `step_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `type` smallint(0) NOT NULL,
  `case_id` int(0) NULL DEFAULT NULL,
  `param_type_id` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `user_id` bigint(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_temp_params_case_id_3ef70ce8_fk_api_case_id`(`case_id`) USING BTREE,
  INDEX `user_temp_params_param_type_id_56215077_fk_conf_param_type_id`(`param_type_id`) USING BTREE,
  INDEX `user_temp_params_user_id_2647a778_fk_auth_user_id`(`user_id`) USING BTREE,
  CONSTRAINT `user_temp_params_case_id_3ef70ce8_fk_api_case_id` FOREIGN KEY (`case_id`) REFERENCES `api_case` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `user_temp_params_param_type_id_56215077_fk_conf_param_type_id` FOREIGN KEY (`param_type_id`) REFERENCES `conf_param_type` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `user_temp_params_user_id_2647a778_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_temp_params
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
